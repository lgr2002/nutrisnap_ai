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

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user?.id || null;
}

export async function saveMealToCloud(input: CloudMealInput) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      ok: false,
      message: "No signed-in user. Meal was not saved to cloud.",
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
}