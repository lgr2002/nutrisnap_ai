import json
import os
from typing import Any, Dict

from openai import OpenAI

from app.models import MealEstimateRequest, MealEstimateResponse


MEAL_ESTIMATE_RESPONSE_FORMAT: Dict[str, Any] = {
    "type": "json_schema",
    "json_schema": {
        "name": "meal_estimate",
        "strict": True,
        "schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "meal_name": {
                    "type": "string"
                },
                "calories": {
                    "type": "integer"
                },
                "calorie_range": {
                    "type": "string"
                },
                "confidence": {
                    "type": "string",
                    "enum": ["High", "Medium", "Low"]
                },
                "protein_g": {
                    "type": "integer"
                },
                "carbs_g": {
                    "type": "integer"
                },
                "fat_g": {
                    "type": "integer"
                },
                "explanation": {
                    "type": "string"
                }
            },
            "required": [
                "meal_name",
                "calories",
                "calorie_range",
                "confidence",
                "protein_g",
                "carbs_g",
                "fat_g",
                "explanation"
            ]
        }
    }
}


def _get_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is missing from backend/.env")

    return OpenAI(api_key=api_key)


def _build_prompt(request: MealEstimateRequest) -> str:
    return f"""
Estimate calories and macros for this meal.

Meal name / description:
{request.meal_name}

Optional details:
{request.optional_details or "None"}

Portion:
{request.portion or "Whole meal"}

Image attached:
{request.image_attached}

Rules:
- Estimate the amount the user likely ate, not a generic database serving.
- Be realistic for takeaway/restaurant food where oil, sauce, cheese and portion size can increase calories.
- If details are limited, use Medium or Low confidence and a wider calorie range.
- Keep explanation short and practical.
- Return only valid JSON matching the required schema.
""".strip()


def estimate_meal_with_openai(request: MealEstimateRequest) -> MealEstimateResponse:
    client = _get_client()

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a careful nutrition estimation assistant. "
                    "You estimate calories and macros from meal descriptions. "
                    "You are realistic about takeaway/restaurant food and uncertainty."
                ),
            },
            {
                "role": "user",
                "content": _build_prompt(request),
            },
        ],
        response_format=MEAL_ESTIMATE_RESPONSE_FORMAT,
    )

    raw_text = completion.choices[0].message.content

    if not raw_text:
        raise RuntimeError("OpenAI returned an empty response")

    parsed = json.loads(raw_text)

    return MealEstimateResponse(
        meal_name=parsed["meal_name"],
        calories=int(parsed["calories"]),
        calorie_range=str(parsed["calorie_range"]),
        confidence=parsed["confidence"],
        protein_g=int(parsed["protein_g"]),
        carbs_g=int(parsed["carbs_g"]),
        fat_g=int(parsed["fat_g"]),
        explanation=str(parsed["explanation"]),
        source="openai",
    )