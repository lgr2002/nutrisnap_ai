import { supabase } from "@/src/api/supabaseClient";

export type CloudMealInput = {
  mealName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: string;
  source: string;
  notes?: string;
  imageUrl?: string;
};

export type CloudMeal = {
  id: string;
  user_id: string;
  meal_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: string;
  source: string | null;
  meal_time: string;
  image_url: string | null;
  notes: string | null;
  created_at: string;
};

function isMissingSessionError(message: string) {
  return (
    message.toLowerCase().includes("auth session missing") ||
    message.toLowerCase().includes("session missing") ||
    message.toLowerCase().includes("not authenticated")
  );
}

export async function getCurrentUserId() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      if (isMissingSessionError(error.message)) {
        return null;
      }

      console.warn("Supabase getUser error:", error.message);
      return null;
    }

    return data.user?.id || null;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not check auth session.";

    if (!isMissingSessionError(message)) {
      console.warn("Supabase auth session check failed:", message);
    }

    return null;
  }
}

export async function saveMealToCloud(input: CloudMealInput) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in to save meals to cloud.",
        mealId: null,
      };
    }

    const { data, error } = await supabase
      .from("meals")
      .insert({
        user_id: userId,
        meal_name: input.mealName,
        calories: input.calories,
        protein_g: input.proteinG,
        carbs_g: input.carbsG,
        fat_g: input.fatG,
        confidence: input.confidence,
        source: input.source,
        notes: input.notes || null,
        image_url: input.imageUrl || null,
        meal_time: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        mealId: null,
      };
    }

    return {
      ok: true,
      message: "Meal saved to cloud.",
      mealId: data.id as string,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Meal could not be saved to cloud.",
      mealId: null,
    };
  }
}

export async function loadCloudMeals() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in to view cloud meal history.",
        meals: [] as CloudMeal[],
      };
    }

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .order("meal_time", { ascending: false });

    if (error) {
      return {
        ok: false,
        message: error.message,
        meals: [] as CloudMeal[],
      };
    }

    return {
      ok: true,
      message: "Cloud meals loaded.",
      meals: (data || []) as CloudMeal[],
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Cloud meals could not be loaded.",
      meals: [] as CloudMeal[],
    };
  }
}

export async function loadTodayCloudMeals() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in to load today's cloud meals.",
        meals: [] as CloudMeal[],
      };
    }

    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .gte("meal_time", startOfDay.toISOString())
      .lt("meal_time", endOfDay.toISOString())
      .order("meal_time", { ascending: false });

    if (error) {
      return {
        ok: false,
        message: error.message,
        meals: [] as CloudMeal[],
      };
    }

    return {
      ok: true,
      message: "Today's cloud meals loaded.",
      meals: (data || []) as CloudMeal[],
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Today's cloud meals could not be loaded.",
      meals: [] as CloudMeal[],
    };
  }
}

export async function deleteCloudMeal(mealId: string) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return {
        ok: false,
        message: "Sign in to delete cloud meals.",
      };
    }

    const { error } = await supabase
      .from("meals")
      .delete()
      .eq("id", mealId)
      .eq("user_id", userId);

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: "Meal deleted.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Meal could not be deleted.",
    };
  }
}