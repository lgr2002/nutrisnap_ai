import { StoredMeal } from "@/src/storage/mealStorage";
import { SavedNutritionTargets } from "@/src/storage/userProfileStorage";

export type DailyTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function calculateDailyTotals(meals: StoredMeal[]): DailyTotals {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
    }),
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );
}

export function getRemainingCalories(
  totals: DailyTotals,
  targets: SavedNutritionTargets
) {
  return Math.max(targets.calories - totals.calories, 0);
}

export function getCalorieProgressPercent(
  totals: DailyTotals,
  targets: SavedNutritionTargets
) {
  if (targets.calories <= 0) {
    return 0;
  }

  return Math.min(Math.round((totals.calories / targets.calories) * 100), 100);
}

export function getMacroPercentage(current: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(Math.round((current / target) * 100), 100);
}

export function buildCoachInsight(
  totals: DailyTotals,
  targets: SavedNutritionTargets,
  mealCount: number
) {
  if (mealCount === 0) {
    return "No meals logged yet. Start with one clear meal scan so your daily coaching becomes useful.";
  }

  if (totals.calories > targets.calories) {
    return "You are above your calorie target today. Keep the next meal lighter and focus on lean protein or fibre.";
  }

  if (totals.protein >= targets.protein) {
    return "Protein target is strong today. You can keep the next meal simpler and avoid adding too much extra oil or sauce.";
  }

  if (totals.protein < targets.protein * 0.5) {
    return "Protein is still low compared with your target. A chicken, egg, tuna, Greek yoghurt or protein shake option would help.";
  }

  if (totals.calories < targets.calories * 0.5) {
    return "Calories are still low for the day. Add a proper meal instead of only snacking, especially if you are training.";
  }

  return "You are tracking well today. Keep portions consistent and add fruit or fibre if the day feels too heavy.";
}

export function getCalorieStatusLabel(
  totals: DailyTotals,
  targets: SavedNutritionTargets
) {
  if (totals.calories > targets.calories) {
    return "Over target";
  }

  if (totals.calories >= targets.calories * 0.9) {
    return "Close to target";
  }

  if (totals.calories >= targets.calories * 0.5) {
    return "On track";
  }

  return "Early day";
}

export function getProteinStatusLabel(
  totals: DailyTotals,
  targets: SavedNutritionTargets
) {
  if (totals.protein >= targets.protein) {
    return "Target hit";
  }

  if (totals.protein >= targets.protein * 0.7) {
    return "Nearly there";
  }

  if (totals.protein >= targets.protein * 0.4) {
    return "Needs more";
  }

  return "Low";
}