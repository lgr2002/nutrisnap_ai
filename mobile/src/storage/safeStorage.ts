import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const memoryStorage = new Map<string, string>();

function canUseWebStorage() {
  return (
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

export async function safeSetItem(key: string, value: string) {
  try {
    if (canUseWebStorage()) {
      window.localStorage.setItem(key, value);
      memoryStorage.set(key, value);
      return;
    }

    await AsyncStorage.setItem(key, value);
    memoryStorage.set(key, value);
  } catch (error) {
    console.warn(
      `SafeStorage fallback used while saving "${key}". Data may not persist after app restart.`,
      error
    );

    memoryStorage.set(key, value);
  }
}

export async function safeGetItem(key: string): Promise<string | null> {
  try {
    if (canUseWebStorage()) {
      const webValue = window.localStorage.getItem(key);

      if (webValue !== null) {
        memoryStorage.set(key, webValue);
        return webValue;
      }

      return memoryStorage.get(key) ?? null;
    }

    const nativeValue = await AsyncStorage.getItem(key);

    if (nativeValue !== null) {
      memoryStorage.set(key, nativeValue);
      return nativeValue;
    }

    return memoryStorage.get(key) ?? null;
  } catch (error) {
    console.warn(
      `SafeStorage fallback used while loading "${key}". Data may not persist after app restart.`,
      error
    );

    return memoryStorage.get(key) ?? null;
  }
}

export async function safeRemoveItem(key: string) {
  try {
    if (canUseWebStorage()) {
      window.localStorage.removeItem(key);
      memoryStorage.delete(key);
      return;
    }

    await AsyncStorage.removeItem(key);
    memoryStorage.delete(key);
  } catch (error) {
    console.warn(
      `SafeStorage fallback used while removing "${key}".`,
      error
    );

    memoryStorage.delete(key);
  }
}