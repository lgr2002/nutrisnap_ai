from app.models import MealEstimateRequest, MealEstimateResponse


def estimate_meal(request: MealEstimateRequest) -> MealEstimateResponse:
    """
    Temporary rule-based estimator.

    This is a backend placeholder. Later this function will call OpenAI Vision
    and return a structured JSON nutrition estimate.
    """

    combined_text = f"{request.meal_name} {request.optional_details or ''}".lower()

    if "pizza" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=1850,
            calorie_range="1,600–2,200",
            confidence="Medium",
            protein_g=85,
            carbs_g=170,
            fat_g=80,
            explanation=(
                "Pizza is usually calorie dense because of cheese, meat toppings, "
                "sauce and crust. This estimate assumes one whole medium pizza."
            ),
        )

    if "chicken" in combined_text and "rice" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=850,
            calorie_range="700–1,050",
            confidence="Medium",
            protein_g=55,
            carbs_g=95,
            fat_g=25,
            explanation=(
                "Chicken rice is usually moderate to high in calories depending "
                "on rice portion, sauce and cooking oil."
            ),
        )

    if "steak" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=1100,
            calorie_range="900–1,350",
            confidence="Medium",
            protein_g=100,
            carbs_g=5,
            fat_g=75,
            explanation=(
                "Steak calories depend heavily on cut, fat level and cooking oil. "
                "This estimate assumes a large steak portion."
            ),
        )

    if "salad" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=420,
            calorie_range="300–650",
            confidence="Low",
            protein_g=25,
            carbs_g=30,
            fat_g=22,
            explanation=(
                "Salads vary a lot depending on dressing, cheese, meat, nuts and oil. "
                "This estimate uses a broad range because details are limited."
            ),
        )

    if "protein shake" in combined_text or "shake" in combined_text:
        return MealEstimateResponse(
            meal_name=request.meal_name,
            calories=320,
            calorie_range="220–500",
            confidence="Medium",
            protein_g=35,
            carbs_g=25,
            fat_g=8,
            explanation=(
                "Protein shake calories depend on milk type, powder amount and added "
                "ingredients. This estimate assumes protein powder with milk."
            ),
        )

    return MealEstimateResponse(
        meal_name=request.meal_name,
        calories=750,
        calorie_range="500–1,000",
        confidence="Low",
        protein_g=35,
        carbs_g=75,
        fat_g=30,
        explanation=(
            "This is a placeholder backend estimate. Later, AI will estimate using "
            "photo, portion and meal description."
        ),
    )