import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import MealEstimateRequest, MealEstimateResponse
from app.services.meal_estimator import estimate_meal, get_ai_mode
from app.services.openai_meal_estimator import get_openai_model_name


load_dotenv()


app = FastAPI(
    title="NutriSnap AI Backend",
    description="Backend API for AI-powered calorie and macro estimation.",
    version="0.5.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "NutriSnap AI backend is running",
        "status": "ok",
        "version": "0.5.0",
    }


@app.get("/health")
def health_check():
    use_openai = os.getenv("USE_OPENAI", "false").lower() == "true"
    has_api_key = bool(os.getenv("OPENAI_API_KEY"))

    return {
        "status": "healthy",
        "version": "0.5.0",
        "environment": os.getenv("APP_ENV", "development"),
        "use_openai": use_openai,
        "ai_mode": get_ai_mode(),
        "openai_model": get_openai_model_name(),
        "openai_key_loaded": has_api_key,
    }

@app.post("/estimate-meal", response_model=MealEstimateResponse)
def estimate_meal_endpoint(request: MealEstimateRequest):
    return estimate_meal(request)