import os

from app.models import MealEstimateRequest, MealEstimateResponse
from app.services.openai_meal_estimator import estimate_meal_with_openai


VALID_AI_MODES = {"fallback", "text", "vision"}


def get_ai_mode() -> str:
    mode = os.getenv("AI_MODE", "fallback").lower().strip()

    if mode not in VALID_AI_MODES:
        return "fallback"

    return mode


def estimate_meal_with_rules(
    request: MealEstimateRequest,
    ai_mode: str = "fallback",
) -> MealEstimateResponse:
    """
    Rule-based fallback estimator.

    Used when OpenAI is disabled, missing, unavailable, or AI_MODE=fallback.
    """

    combined_text = f"{request.meal_name} {request.optional_details or ''}".lower()

    if "pizza" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=1850,
            calorie_range="1,600-2,200",
            confidence="Medium",
            protein_g=85,
            carbs_g=170,
            fat_g=80,
            explanation=(
                "Fallback estimate: pizza is usually calorie dense because of cheese, "
                "meat toppings, sauce and crust. Assumes one whole medium pizza."
            ),
            source="rule_fallback",
            ai_mode=ai_mode,
        )

    if "chicken" in combined_text and "rice" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=850,
            calorie_range="700-1,050",
            confidence="Medium",
            protein_g=55,
            carbs_g=95,
            fat_g=25,
            explanation=(
                "Fallback estimate: chicken rice calories depend on rice portion, "
                "sauce and cooking oil."
            ),
            source="rule_fallback",
            ai_mode=ai_mode,
        )

    if "steak" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=1100,
            calorie_range="900-1,350",
            confidence="Medium",
            protein_g=100,
            carbs_g=5,
            fat_g=75,
            explanation=(
                "Fallback estimate: steak calories depend heavily on cut, fat level "
                "and cooking oil. Assumes a large steak portion."
            ),
            source="rule_fallback",
            ai_mode=ai_mode,
        )

    if "salad" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=420,
            calorie_range="300-650",
            confidence="Low",
            protein_g=25,
            carbs_g=30,
            fat_g=22,
            explanation=(
                "Fallback estimate: salads vary depending on dressing, cheese, meat, "
                "nuts and oil."
            ),
            source="rule_fallback",
            ai_mode=ai_mode,
        )

    if "protein shake" in combined_text or "shake" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=320,
            calorie_range="220-500",
            confidence="Medium",
            protein_g=35,
            carbs_g=25,
            fat_g=8,
            explanation=(
                "Fallback estimate: protein shake calories depend on milk type, "
                "powder amount and added ingredients."
            ),
            source="rule_fallback",
            ai_mode=ai_mode,
        )

    if "monster" in combined_text or "energy drink" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=10,
            calorie_range="0-20",
            confidence="Medium",
            protein_g=0,
            carbs_g=1,
            fat_g=0,
            explanation=(
                "Fallback estimate: sugar-free energy drinks are usually very low calorie. "
                "Regular versions can be much higher."
            ),
            source="rule_fallback",
            ai_mode=ai_mode,
        )

    return MealEstimateResponse(
        meal_name=request.meal_name,
        calories=750,
        calorie_range="500-1,000",
        confidence="Low",
        protein_g=35,
        carbs_g=75,
        fat_g=30,
        explanation=(
            "Fallback estimate: limited details were provided, so this uses a broad "
            "generic estimate."
        ),
        source="rule_fallback",
        ai_mode=ai_mode,
    )


def estimate_meal(request: MealEstimateRequest) -> MealEstimateResponse:
    use_openai = os.getenv("USE_OPENAI", "false").lower() == "true"
    ai_mode = get_ai_mode()

    if not use_openai or ai_mode == "fallback":
        return estimate_meal_with_rules(request, ai_mode="fallback")

    request_for_openai = request

    if ai_mode == "text":
        request_for_openai = request.model_copy(
            update={
                "image_attached": bool(request.image_attached),
                "image_base64": None,
                "image_mime_type": None,
            }
        )

    try:
        response = estimate_meal_with_openai(request_for_openai)
        response.ai_mode = ai_mode
        return response
    except Exception as error:
        print(f"OpenAI estimate failed. Falling back to rules. Error: {error}")
        return estimate_meal_with_rules(request, ai_mode=ai_mode)