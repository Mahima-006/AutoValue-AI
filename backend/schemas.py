"""
AutoValue AI — Pydantic Schemas
Request and Response models for the /predict endpoint.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class FuelType(str, Enum):
    petrol = "Petrol"
    diesel = "Diesel"
    cng = "CNG"
    lpg = "LPG"


class Condition(str, Enum):
    fair = "Fair"
    good = "Good"
    excellent = "Excellent"


class CarInput(BaseModel):

    company: str

    year: int = Field(
        ...,
        ge=1990,
        le=datetime.now().year
    )

    name: str

    kms_driven: float = Field(
        ...,
        ge=0,
        le=500000
    )

    fuel_type: FuelType

    condition: Condition = Condition.good

    features: List[str] = Field(
        default_factory=list
    )

    location: Optional[str] = None

class PriceTrendPoint(BaseModel):
    month: str
    predicted: float
    market_avg: float


class PredictionResponse(BaseModel):
    """Response schema from the /predict endpoint."""
    predicted_price: float = Field(..., description="Predicted market value in INR")
    currency: str = Field(default="INR")
    confidence_score: float = Field(..., ge=0, le=1, description="Model confidence (0–1)")
    market_volatility: str = Field(..., description="Low / Medium / High")
    price_trend: List[PriceTrendPoint] = Field(..., description="12-month historical trend")
    percentile: str = Field(..., description="Price percentile vs similar cars")
    car_age: int
    model_r2: float


class ModelInfoResponse(BaseModel):
    model_type: str
    training_date: str
    train_size: int
    test_size: int
    r2: float
    rmse: float
    mae: float
    version: str = "1.0"
