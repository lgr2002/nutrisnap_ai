import { API_BASE_URL } from "@/src/api/config";

export type BackendMealEstimateRequest = {
  meal_name: string;
  optional_details?: string;
  portion?: string;
  image_attached?: boolean;
  image_base64?: string;
  image_mime_type?: string;
};

export type BackendMealEstimateResponse = {
  meal_name: string;
  calories: number;
  calorie_range: string;
  confidence: "High" | "Medium" | "Low";
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  explanation: string;
  source?: string;
};

export async function estimateMealWithBackend(
  request: BackendMealEstimateRequest
): Promise<BackendMealEstimateResponse> {
  const response = await fetch(`${API_BASE_URL}/estimate-meal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Backend request failed with status ${response.status}`);
  }

  return response.json();
}