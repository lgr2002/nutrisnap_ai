import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_STATUS_KEY = "nutrisnap_premium_status_v1";

export async function setPremiumStatus(isPremium: boolean) {
  try {
    await AsyncStorage.setItem(PREMIUM_STATUS_KEY, isPremium ? "true" : "false");
  } catch (error) {
    console.error("Failed to save premium status:", error);
  }
}

export async function getPremiumStatus(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
    return value === "true";
  } catch (error) {
    console.error("Failed to load premium status:", error);
    return false;
  }
}

export async function resetPremiumStatus() {
  try {
    await AsyncStorage.removeItem(PREMIUM_STATUS_KEY);
  } catch (error) {
    console.error("Failed to reset premium status:", error);
  }
}