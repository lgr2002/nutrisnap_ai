import AsyncStorage from "@react-native-async-storage/async-storage";

export type StoredMeal = {
  id: string;
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: string;
};

const MEALS_STORAGE_KEY = "nutrisnap_meals_today_v1";

export async function saveMealsToStorage(meals: StoredMeal[]) {
  try {
    const mealJson = JSON.stringify(meals);
    await AsyncStorage.setItem(MEALS_STORAGE_KEY, mealJson);
  } catch (error) {
    console.error("Failed to save meals:", error);
  }
}

export async function loadMealsFromStorage(): Promise<StoredMeal[] | null> {
  try {
    const storedMeals = await AsyncStorage.getItem(MEALS_STORAGE_KEY);

    if (!storedMeals) {
      return null;
    }

    const parsedMeals = JSON.parse(storedMeals);

    if (!Array.isArray(parsedMeals)) {
      return null;
    }

    return parsedMeals;
  } catch (error) {
    console.error("Failed to load meals:", error);
    return null;
  }
}

export async function clearMealsFromStorage() {
  try {
    await AsyncStorage.removeItem(MEALS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear meals:", error);
  }
}