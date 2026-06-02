from pydantic import BaseModel, Field
from typing import Literal, Optional


ConfidenceLevel = Literal["High", "Medium", "Low"]


class MealEstimateRequest(BaseModel):
    meal_name: str = Field(..., min_length=1)
    optional_details: Optional[str] = ""
    portion: Optional[str] = "Whole meal"
    image_attached: bool = False
    image_base64: Optional[str] = None
    image_mime_type: Optional[str] = None


class MealEstimateResponse(BaseModel):
    meal_name: str
    calories: int
    calorie_range: str
    confidence: ConfidenceLevel
    protein_g: int
    carbs_g: int
    fat_g: int
    explanation: str
    source: str = "rule_fallback"
    ai_mode: str = "fallback"