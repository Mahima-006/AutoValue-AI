# AutoValue AI — Car Price Predictor

**AutoValue AI** is a full-stack ML-powered web app that predicts the market value of used cars (Indian market, INR pricing). It features an animated "cockpit" UI, a FastAPI REST backend, and a Random Forest model trained on real Quikr listing data.

---

## Project Structure

```
/data/
  car_data.csv           ← Quikr used-cars dataset (892 rows)
/ml/
  train_model.py         ← Training pipeline
  /artifacts/
    model_pipeline.joblib
    model_metrics.json
    feature_importance.json
/backend/
  main.py
  schemas.py
  requirements.txt
/frontend/
  (React + Vite app)
README.md
.env.example
DEMO_SCRIPT.md
```

---

## Model Performance (Quikr dataset, 815 clean rows)

| Model | R² | RMSE | MAE |
|---|---|---|---|
| Linear Regression (baseline) | 0.557 | ₹3,00,252 | ₹1,51,482 |
| **Random Forest Regressor ✓** | **0.631** | **₹2,74,167** | **₹1,13,779** |
| Gradient Boosting | 0.604 | ₹2,83,986 | ₹1,20,318 |

Best model: **Random Forest Regressor** (after RandomizedSearchCV tuning)

> Note: This is a 892-row showcase dataset. Model is demo-grade, not production-grade.

---

## Local Setup

### 1. Prerequisites
- Python 3.9+ with pip
- Node.js 18+ with npm

### 2. Train the Model

```bash
cd car_price_predictor
pip install scikit-learn xgboost pandas numpy joblib
python ml/train_model.py
```

This saves `ml/artifacts/model_pipeline.joblib` and metric files.

### 3. Run the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Test: open http://localhost:8000/docs for the Swagger UI.

### 4. Run the Frontend

```bash
cd frontend
cp .env.local.example .env.local   # or just use the existing .env.local
npm install
npm run dev
```

Open http://localhost:5173

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/model-info` | Model metadata (type, R², RMSE, training date) |
| POST | `/predict` | Predict car market value |

### Example `/predict` request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Hyundai",
    "year": 2019,
    "name": "Creta",
    "kms_driven": 45000,
    "fuel_type": "Petrol",
    "condition": "Good",
    "features": ["Leather Seats"],
    "location": "Mumbai"
  }'
```

---

## Deployment

### Backend → Render.com (free tier)

1. Push `/backend` to a GitHub repo (or use the full repo with a `Procfile`)
2. Create a new **Web Service** on Render
3. Build command: `pip install -r backend/requirements.txt`
4. Start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Set env var `PYTHONPATH=.` in Render dashboard
6. **Important**: also upload `ml/artifacts/` — Render's disk is ephemeral, so run training as part of the build step, or use a persistent volume / cloud storage.

### Frontend → Vercel (free tier)

1. Push `/frontend` to GitHub
2. Import the repo in Vercel
3. Framework preset: **Vite**
4. Root directory: `frontend`
5. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`

---

## Environment Variables

| Variable | Where | Value |
|----------|-------|-------|
| `VITE_API_URL` | `frontend/.env.local` | `http://localhost:8000` (dev) or Render URL (prod) |

---

## Tech Stack

- **ML**: Python, scikit-learn, XGBoost, pandas, joblib
- **Backend**: FastAPI, Uvicorn, Pydantic v2
- **Frontend**: React 19, Vite, Framer Motion, Recharts, Inter font
- **Deployment**: Vercel (frontend) + Render (backend)
