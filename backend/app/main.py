from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import MealEstimateRequest, MealEstimateResponse
from app.services.meal_estimator import estimate_meal


load_dotenv()


app = FastAPI(
    title="NutriSnap AI Backend",
    description="Backend API for AI-powered calorie and macro estimation.",
    version="0.2.0",
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
        "version": "0.2.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }


@app.post("/estimate-meal", response_model=MealEstimateResponse)
def estimate_meal_endpoint(request: MealEstimateRequest):
    return estimate_meal(request)