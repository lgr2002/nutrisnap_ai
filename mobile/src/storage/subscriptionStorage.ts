import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from "@/src/storage/safeStorage";

const PREMIUM_STATUS_KEY = "nutrisnap_premium_status_v1";

export async function setPremiumStatus(isPremium: boolean) {
  try {
    await safeSetItem(PREMIUM_STATUS_KEY, isPremium ? "true" : "false");
  } catch (error) {
    console.error("Failed to save premium status:", error);
  }
}

export async function getPremiumStatus(): Promise<boolean> {
  try {
    const value = await safeGetItem(PREMIUM_STATUS_KEY);
    return value === "true";
  } catch (error) {
    console.error("Failed to load premium status:", error);
    return false;
  }
}

export async function resetPremiumStatus() {
  try {
    await safeRemoveItem(PREMIUM_STATUS_KEY);
  } catch (error) {
    console.error("Failed to reset premium status:", error);
  }
}