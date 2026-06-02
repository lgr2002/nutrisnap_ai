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
  ai_mode?: string;
};

export class BackendRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "BackendRequestError";
    this.status = status;
  }
}

function getFriendlyBackendError(error: unknown) {
  if (error instanceof BackendRequestError) {
    if (error.status === 500) {
      return "The AI backend had an internal error. Try again in a moment.";
    }

    if (error.status === 413) {
      return "The image is too large. Try a smaller or clearer photo.";
    }

    if (error.status === 429) {
      return "The AI service is rate limited or out of quota. Try again later.";
    }

    return error.message;
  }

  if (error instanceof TypeError) {
    return (
      "Could not reach the backend. If this is the first request, the free server may still be waking up."
    );
  }

  return "Something went wrong while contacting the backend.";
}

export async function estimateMealWithBackend(
  request: BackendMealEstimateRequest
): Promise<BackendMealEstimateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/estimate-meal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new BackendRequestError(
        `Backend request failed with status ${response.status}`,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    throw new BackendRequestError(getFriendlyBackendError(error));
  }
}