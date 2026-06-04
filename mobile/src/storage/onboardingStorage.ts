import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from "@/src/storage/safeStorage";

const ONBOARDING_COMPLETED_KEY = "nutrisnap_onboarding_completed_v3";

export async function markOnboardingCompleted() {
  try {
    await safeSetItem(ONBOARDING_COMPLETED_KEY, "true");
  } catch (error) {
    console.error("Failed to mark onboarding completed:", error);
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await safeGetItem(ONBOARDING_COMPLETED_KEY);
    return value === "true";
  } catch (error) {
    console.error("Failed to load onboarding state:", error);
    return false;
  }
}

export async function resetOnboardingState() {
  try {
    await safeRemoveItem(ONBOARDING_COMPLETED_KEY);
  } catch (error) {
    console.error("Failed to reset onboarding state:", error);
  }
}

/**
 * Compatibility aliases.
 * These prevent old/new screens from breaking if they use different names.
 */
export const saveOnboardingComplete = markOnboardingCompleted;
export const loadOnboardingComplete = hasCompletedOnboarding;
export const resetOnboardingComplete = resetOnboardingState;