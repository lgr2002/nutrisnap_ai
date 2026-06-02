import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedUserProfile = {
  name: string;
  goal: string;
  age: number;
  heightCm: number;
  weightKg: number;
  sex: string;
  activityLevel: string;
  units: string;
  diet: string;
  theme: string;
};

export type SavedNutritionTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const USER_PROFILE_KEY = "nutrisnap_user_profile_v1";
const NUTRITION_TARGETS_KEY = "nutrisnap_nutrition_targets_v1";

export async function saveUserProfile(profile: SavedUserProfile) {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save user profile:", error);
  }
}

export async function loadUserProfile(): Promise<SavedUserProfile | null> {
  try {
    const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);

    if (!storedProfile) {
      return null;
    }

    return JSON.parse(storedProfile);
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return null;
  }
}

export async function saveNutritionTargets(targets: SavedNutritionTargets) {
  try {
    await AsyncStorage.setItem(NUTRITION_TARGETS_KEY, JSON.stringify(targets));
  } catch (error) {
    console.error("Failed to save nutrition targets:", error);
  }
}

export async function loadNutritionTargets(): Promise<SavedNutritionTargets | null> {
  try {
    const storedTargets = await AsyncStorage.getItem(NUTRITION_TARGETS_KEY);

    if (!storedTargets) {
      return null;
    }

    return JSON.parse(storedTargets);
  } catch (error) {
    console.error("Failed to load nutrition targets:", error);
    return null;
  }
}

export async function resetUserProfileAndTargets() {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
    await AsyncStorage.removeItem(NUTRITION_TARGETS_KEY);
  } catch (error) {
    console.error("Failed to reset user profile and targets:", error);
  }
}