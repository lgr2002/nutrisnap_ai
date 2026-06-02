import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_COMPLETED_KEY = "nutrisnap_onboarding_completed_v1";

export async function markOnboardingCompleted() {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
  } catch (error) {
    console.error("Failed to mark onboarding completed:", error);
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return value === "true";
  } catch (error) {
    console.error("Failed to load onboarding state:", error);
    return false;
  }
}

export async function resetOnboardingState() {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  } catch (error) {
    console.error("Failed to reset onboarding state:", error);
  }
}