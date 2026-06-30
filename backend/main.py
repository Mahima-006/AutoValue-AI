"""
AutoValue AI — FastAPI Backend
Serves the trained car price prediction model via REST API.

Start: uvicorn main:app --reload --port 8000
"""

import os, json
import numpy as np
import joblib
import pandas as pd
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import CarInput, PredictionResponse, PriceTrendPoint, ModelInfoResponse
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
# 1. Load Model Artifacts at Startup
# ─────────────────────────────────────────────
BASE_DIR     = os.path.dirname(__file__)
ARTIFACT_DIR = os.path.join(BASE_DIR, "..", "ml", "artifacts")

try:
    pipeline = joblib.load(os.path.join(ARTIFACT_DIR, "model_pipeline.joblib"))
    with open(os.path.join(ARTIFACT_DIR, "model_metrics.json")) as f:
        metrics = json.load(f)
    with open(os.path.join(ARTIFACT_DIR, "feature_importance.json")) as f:
        feature_importance = json.load(f)
    logger.info("Model artifacts loaded successfully")
except Exception as e:
    logger.exception("Unable to load model")
    raise

# ─────────────────────────────────────────────
# 2. App Setup
# ─────────────────────────────────────────────
app = FastAPI(
    title="AutoValue AI API",
    description="Car price prediction API powered by ML",
    version="1.0.0",
)

from os import getenv
allowed_origins = getenv("ALLOWED_ORIGINS","http://localhost:5173,http://127.0.0.1:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# 3. Helper Functions
# ─────────────────────────────────────────────
def normalize_company(company: str) -> str:
    """Match company to known training values."""
    known = {x.lower() for x in metrics.get("feature_meta", {}).get("top_companies", [])}
    c = company.strip().lower()
    return c if c in known else "other"

def normalize_fuel(fuel: str) -> str:
    mapping = {"petrol": "petrol", "diesel": "diesel", "cng": "cng", "lpg": "lpg", "electric": "other"}
    return mapping.get(fuel.strip().lower(), "petrol")

def normalize_model(name: str) -> str:
    """Extract 2-token model slug, fallback to 'other'."""
    known = {x.lower() for x in metrics["feature_meta"]["top_models"]}
    slug = " ".join(name.strip().lower().split()[:2])
    return slug if slug in known else "other"

def compute_confidence(predicted: float, condition: str) -> float:
    """
    Heuristic confidence derived from the model's R² and the condition quality.
    NOT a statistical prediction interval — labeled as 'illustrative' in API docs.
    """
    base_r2 = metrics.get("best_model", {}).get("r2_tuned", metrics.get("best_model", {}).get("r2", 0.7))
    condition_boost = {"fair": -0.05, "good": 0.0, "excellent": 0.03}.get(condition.lower(), 0.0)
    # Add slight noise to avoid a perfectly static number
    noise = np.random.uniform(-0.02, 0.02)
    return round(min(0.97, max(0.55, base_r2 + condition_boost + noise)), 2)

def compute_volatility(predicted: float) -> str:
    """
    Heuristic market volatility based on price band.
    Higher-priced cars tend to have more volatile resale markets.
    NOTE: Illustrative — not from a live market feed.
    """
    if predicted < 200_000:
        return "Low"
    elif predicted < 600_000:
        return "Medium"
    else:
        return "High"

def compute_percentile(predicted: float, condition: str) -> str:
    """
    Derive value percentile from price band + condition.
    NOTE: Illustrative heuristic, not a true percentile from dataset query.
    """
    if predicted > 600_000 and condition.lower() == "excellent":
        return "Top 5%"
    elif predicted > 400_000:
        return "Top 15%"
    elif predicted > 200_000:
        return "Top 35%"
    else:
        return "Top 50%"

def build_price_trend(predicted: float, company: str) -> list[dict]:
    """
    Generate a 12-month illustrative price trend.
    Uses a gentle seasonal depreciation curve + random market noise.
    NOTE: These are heuristic projections, not real historical market data.
    """
    trend = []
    now = datetime.now()
    # Typical used-car depreciation: ~10–15% per year = ~0.9-1.2% per month
    monthly_depreciation = 0.011  # ~13% annual
    # Market average is typically 5–8% above the predicted (dealer markup)
    market_markup = 1.065

    for i in range(11, -1, -1):
        month_dt = now - timedelta(days=i * 30)
        # Past value before current depreciation
        months_ago = i
        historical_price = predicted * ((1 + monthly_depreciation) ** months_ago)
        market_avg = historical_price * market_markup
        # Add small random ±3% noise
        noise = np.random.uniform(-0.03, 0.03)
        historical_price *= (1 + noise)
        market_avg *= (1 + noise * 0.5)
        trend.append({
            "month": month_dt.strftime("%b %Y"),
            "predicted": round(historical_price),
            "market_avg": round(market_avg)
        })
    return trend

# ─────────────────────────────────────────────
# 4. Endpoints
# ─────────────────────────────────────────────
@app.get("/health", summary="Liveness check")
def health():
    return {"status": "ok", "model_loaded": pipeline is not None, "timestamp": datetime.now().isoformat()}


@app.get("/model-info", response_model=ModelInfoResponse, summary="Model metadata")
def model_info():
    if not metrics:
        raise HTTPException(status_code=503, detail="Model artifacts not loaded")
    best = metrics.get("best_model", {})
    return ModelInfoResponse(
        model_type=metrics.get("model_type", "Unknown"),
        training_date=metrics.get("training_date", "N/A"),
        train_size=metrics.get("train_size", 0),
        test_size=metrics.get("test_size", 0),
        r2=best.get("r2_tuned", best.get("r2", 0)),
        rmse=best.get("rmse_tuned", best.get("rmse", 0)),
        mae=best.get("mae_tuned", best.get("mae", 0)),
    )


@app.post("/predict", response_model=PredictionResponse, summary="Predict car market value")
def predict(car: CarInput):
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train_model.py first.")

    car_age = datetime.now().year - car.year

    # Build the input DataFrame matching training features exactly
    input_df = pd.DataFrame([{
        "kms_driven":  car.kms_driven,
        "car_age":     car_age,
        "company":     normalize_company(car.company),
        "fuel_type":   normalize_fuel(car.fuel_type),
        "model_name":  normalize_model(car.name),
    }])

    # --- Condition adjustment (heuristic, on top of model prediction) ---
    # NOTE: condition was not in the original dataset; we apply a post-prediction multiplier
    condition_multiplier = {"fair": 0.88, "good": 1.0, "excellent": 1.12}.get(car.condition.lower(), 1.0)

    # --- Premium features adjustment (illustrative) ---
    feature_bump = len(car.features or []) * 0.02  # each feature adds ~2%

    raw_prediction = float(pipeline.predict(input_df)[0])
    adjusted_price = raw_prediction * condition_multiplier * (1 + feature_bump)
    adjusted_price = max(adjusted_price, 50_000)  # floor at ₹50k

    # Derived stats (all heuristic — clearly labeled in comments above helpers)
    confidence     = compute_confidence(adjusted_price, car.condition)
    volatility     = compute_volatility(adjusted_price)
    percentile     = compute_percentile(adjusted_price, car.condition)
    trend          = build_price_trend(adjusted_price, car.company)
    best           = metrics.get("best_model", {})

    return PredictionResponse(
        predicted_price=round(adjusted_price, 2),
        currency="INR",
        confidence_score=confidence,
        market_volatility=volatility,
        price_trend=[PriceTrendPoint(**t) for t in trend],
        percentile=percentile,
        car_age=car_age,
        model_r2=best.get("r2_tuned", best.get("r2", 0)),
    )
