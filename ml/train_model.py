"""
AutoValue AI — ML Training Pipeline
Dataset: Quikr used-cars (Indian market, INR prices)
Columns: name, company, year, Price, kms_driven, fuel_type

Run: python train_model.py
Outputs (saved to ./artifacts/):
  - model_pipeline.joblib   : full sklearn Pipeline (preprocessor + best model)
  - model_metrics.json      : R², RMSE, MAE for all 3 candidate models + best
  - feature_importance.json : top feature importances from the winning tree model
"""

import os, json, warnings, time
import numpy as np
import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

warnings.filterwarnings("ignore")

# ─────────────────────────────────────────────
# 0. Config
# ─────────────────────────────────────────────
DATA_PATH    = os.path.join(os.path.dirname(__file__), "..", "data", "car_data.csv")
ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACT_DIR, exist_ok=True)

RANDOM_STATE = 42
TOP_N_MODELS = 20      # keep top-N car model names, rest → "Other"
TOP_N_COMPANIES = 15   # keep top-N manufacturers, rest → "Other"

# ─────────────────────────────────────────────
# 1. Load & Profile
# ─────────────────────────────────────────────
print("\n" + "═"*60)
print("  AutoValue AI — Model Training Pipeline")
print("═"*60)

df_raw = pd.read_csv(DATA_PATH)
print(f"\n[1] Raw dataset: {df_raw.shape[0]} rows × {df_raw.shape[1]} cols")
print(f"    Columns : {list(df_raw.columns)}")
print(f"\n    --- Data Profile ---")
for col in df_raw.columns:
    nulls = df_raw[col].isnull().sum()
    unique = df_raw[col].nunique()
    sample = df_raw[col].dropna().iloc[0] if nulls < df_raw.shape[0] else "N/A"
    print(f"    {col:20s}  dtype={str(df_raw[col].dtype):8s}  nulls={nulls:4d}  unique={unique:5d}  sample={str(sample)[:40]}")

# ─────────────────────────────────────────────
# 2. Clean
# ─────────────────────────────────────────────
print("\n[2] Cleaning …")
df = df_raw.copy()

# Drop rows where Price is "Ask For Price" or null
df = df[~df["Price"].isin(["Ask For Price"])]
df = df.dropna(subset=["Price", "kms_driven", "fuel_type", "year", "company"])

# Clean Price: "4,25,000" → 425000
def parse_price(val):
    try:
        return float(str(val).replace(",", "").strip())
    except:
        return np.nan

# Clean kms_driven: "45,000 kms" → 45000
def parse_kms(val):
    try:
        return float(str(val).replace(",", "").replace("kms", "").replace("km", "").strip())
    except:
        return np.nan

df["Price"]      = df["Price"].apply(parse_price)
df["kms_driven"] = df["kms_driven"].apply(parse_kms)
df["year"]       = pd.to_numeric(df["year"], errors="coerce")

# Drop rows with NaN after parsing
df = df.dropna(subset=["Price", "kms_driven", "year"])

# Remove extreme outliers: price must be > 10,000 INR and < 5 crore INR
df = df[(df["Price"] > 10_000) & (df["Price"] < 5_000_000)]
# kms_driven must be 0–500,000
df = df[(df["kms_driven"] >= 0) & (df["kms_driven"] <= 500_000)]
# year must be 1990–2024
df = df[(df["year"] >= 1990) & (df["year"] <= 2024)]

print(f"    Clean dataset: {df.shape[0]} rows")

# ─────────────────────────────────────────────
# 3. Feature Engineering
# ─────────────────────────────────────────────
print("\n[3] Feature engineering …")

# Derive car_age from year
df["car_age"] = 2024 - df["year"].astype(int)

# Extract short model name (first 2 tokens of 'name', lowercase)
df["model_name"] = df["name"].str.strip().str.split().str[:2].str.join(" ").str.lower()

# Consolidate rare model names → "Other"
top_models   = df["model_name"].value_counts().nlargest(TOP_N_MODELS).index
df["model_name"] = df["model_name"].where(df["model_name"].isin(top_models), "other")

# Consolidate rare companies → "Other"
top_companies = df["company"].str.lower().value_counts().nlargest(TOP_N_COMPANIES).index
df["company"] = df["company"].str.lower().where(df["company"].str.lower().isin(top_companies), "other")

# fuel_type: lowercase
df["fuel_type"] = df["fuel_type"].str.lower().str.strip()

# Features and target
NUM_FEATURES = ["kms_driven", "car_age"]
CAT_FEATURES = ["company", "fuel_type", "model_name"]
TARGET       = "Price"

X = df[NUM_FEATURES + CAT_FEATURES]
y = df[TARGET]

print(f"    Numeric features : {NUM_FEATURES}")
print(f"    Categorical features: {CAT_FEATURES}")
print(f"    Target stats: min={y.min():,.0f}  max={y.max():,.0f}  mean={y.mean():,.0f}  median={y.median():,.0f}")

# Save the feature list for the API
feature_meta = {
    "numeric_features": NUM_FEATURES,
    "categorical_features": CAT_FEATURES,
    "top_companies": list(top_companies),
    "top_models": list(top_models),
    "car_age_base_year": 2024
}

# ─────────────────────────────────────────────
# 4. Train / Test Split
# ─────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=RANDOM_STATE
)
print(f"\n[4] Train={len(X_train)}  Test={len(X_test)}")

# ─────────────────────────────────────────────
# 5. Preprocessing Pipeline
# ─────────────────────────────────────────────
preprocessor = ColumnTransformer(transformers=[
    ("num", StandardScaler(),                                     NUM_FEATURES),
    ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CAT_FEATURES),
])

# ─────────────────────────────────────────────
# 6. Train & Compare 3 Models
# ─────────────────────────────────────────────
print("\n[5] Training 3 candidate models …\n")

def evaluate(name, pipeline, X_tr, y_tr, X_te, y_te):
    t0 = time.time()
    pipeline.fit(X_tr, y_tr)
    elapsed = time.time() - t0
    preds = pipeline.predict(X_te)
    r2   = r2_score(y_te, preds)
    rmse = np.sqrt(mean_squared_error(y_te, preds))
    mae  = mean_absolute_error(y_te, preds)
    print(f"  {name:35s}  R²={r2:.4f}  RMSE={rmse:>12,.0f}  MAE={mae:>11,.0f}  ({elapsed:.1f}s)")
    return {"model_name": name, "r2": round(r2, 4), "rmse": round(rmse, 2), "mae": round(mae, 2)}

candidates = [
    ("Linear Regression (baseline)",
     Pipeline([("pre", preprocessor), ("model", LinearRegression())])),
    ("Random Forest Regressor",
     Pipeline([("pre", preprocessor), ("model", RandomForestRegressor(n_estimators=200, random_state=RANDOM_STATE, n_jobs=-1))])),
    ("Gradient Boosting (XGBoost-style)",
     Pipeline([("pre", preprocessor), ("model", GradientBoostingRegressor(n_estimators=300, learning_rate=0.05, max_depth=5, random_state=RANDOM_STATE))])),
]

print(f"  {'Model':35s}  {'R²':>7}  {'RMSE':>14}  {'MAE':>13}  Time")
print("  " + "-"*85)

all_metrics = []
trained_pipes = {}
for name, pipe in candidates:
    metrics = evaluate(name, pipe, X_train, y_train, X_test, y_test)
    all_metrics.append(metrics)
    trained_pipes[name] = pipe

# ─────────────────────────────────────────────
# 7. Pick Best & Tune
# ─────────────────────────────────────────────
best_entry  = max(all_metrics, key=lambda m: m["r2"])
best_name   = best_entry["model_name"]
best_pipe   = trained_pipes[best_name]
print(f"\n[6] Best model: {best_name}  (R²={best_entry['r2']})")

# Hyperparameter tuning on Gradient Boosting / RF
print("    Running RandomizedSearchCV (20 iterations) …")

if "Gradient Boosting" in best_name:
    param_dist = {
        "model__n_estimators":   [200, 300, 400],
        "model__learning_rate":  [0.03, 0.05, 0.1],
        "model__max_depth":      [4, 5, 6],
        "model__subsample":      [0.8, 0.9, 1.0],
        "model__min_samples_leaf": [3, 5, 10],
    }
elif "Random Forest" in best_name:
    param_dist = {
        "model__n_estimators": [200, 300, 400],
        "model__max_depth":    [None, 10, 20, 30],
        "model__min_samples_split": [2, 5, 10],
        "model__min_samples_leaf":  [1, 2, 4],
    }
else:
    param_dist = {}  # Linear Regression has no useful hyperparams

if param_dist:
    search = RandomizedSearchCV(
        best_pipe, param_dist,
        n_iter=20, cv=3, scoring="r2",
        random_state=RANDOM_STATE, n_jobs=-1, verbose=0
    )
    search.fit(X_train, y_train)
    best_pipe = search.best_estimator_
    tuned_preds = best_pipe.predict(X_test)
    tuned_r2   = r2_score(y_test, tuned_preds)
    tuned_rmse = np.sqrt(mean_squared_error(y_test, tuned_preds))
    tuned_mae  = mean_absolute_error(y_test, tuned_preds)
    print(f"    Tuned → R²={tuned_r2:.4f}  RMSE={tuned_rmse:,.0f}  MAE={tuned_mae:,.0f}")
    best_entry.update({"r2_tuned": round(tuned_r2, 4), "rmse_tuned": round(tuned_rmse, 2), "mae_tuned": round(tuned_mae, 2)})
else:
    print("    (Linear Regression — no hyperparams to tune)")
    tuned_r2, tuned_rmse, tuned_mae = best_entry["r2"], best_entry["rmse"], best_entry["mae"]

# ─────────────────────────────────────────────
# 8. Feature Importance
# ─────────────────────────────────────────────
print("\n[7] Extracting feature importances …")

try:
    inner_model  = best_pipe.named_steps["model"]
    pre_fitted   = best_pipe.named_steps["pre"]
    # Get feature names from the fitted preprocessor
    num_names    = NUM_FEATURES
    cat_names    = pre_fitted.named_transformers_["cat"].get_feature_names_out(CAT_FEATURES).tolist()
    all_feat_names = num_names + cat_names

    importances  = inner_model.feature_importances_
    fi_pairs     = sorted(zip(all_feat_names, importances), key=lambda x: -x[1])[:20]
    fi_json      = [{"feature": f, "importance": round(float(v), 5)} for f, v in fi_pairs]
    print("    Top 5 features:", [(f, round(v,4)) for f,v in fi_pairs[:5]])
except Exception as e:
    fi_json = []
    print(f"    (Could not extract importances: {e})")

# ─────────────────────────────────────────────
# 9. Save Artifacts
# ─────────────────────────────────────────────
print("\n[8] Saving artifacts …")

import datetime
metrics_out = {
    "training_date": datetime.datetime.now().isoformat(),
    "model_type":    best_name,
    "train_size":    len(X_train),
    "test_size":     len(X_test),
    "all_models":    all_metrics,
    "best_model":    best_entry,
    "feature_meta":  feature_meta
}

joblib.dump(best_pipe, os.path.join(ARTIFACT_DIR, "model_pipeline.joblib"))
with open(os.path.join(ARTIFACT_DIR, "model_metrics.json"), "w") as f:
    json.dump(metrics_out, f, indent=2)
with open(os.path.join(ARTIFACT_DIR, "feature_importance.json"), "w") as f:
    json.dump(fi_json, f, indent=2)

print(f"    ✓ model_pipeline.joblib")
print(f"    ✓ model_metrics.json")
print(f"    ✓ feature_importance.json")
print("\n" + "═"*60)
print("  Training complete!")
print("═"*60 + "\n")
