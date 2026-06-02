import AsyncStorage from "@react-native-async-storage/async-storage";

const SCAN_USAGE_KEY = "nutrisnap_scan_usage_v1";
const FREE_DAILY_SCAN_LIMIT = 3;

type ScanUsage = {
  dateKey: string;
  count: number;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getFreeDailyScanLimit() {
  return FREE_DAILY_SCAN_LIMIT;
}

export async function loadTodayScanCount(): Promise<number> {
  try {
    const storedValue = await AsyncStorage.getItem(SCAN_USAGE_KEY);

    if (!storedValue) {
      return 0;
    }

    const usage: ScanUsage = JSON.parse(storedValue);
    const todayKey = getTodayKey();

    if (usage.dateKey !== todayKey) {
      return 0;
    }

    return usage.count;
  } catch (error) {
    console.error("Failed to load scan usage:", error);
    return 0;
  }
}

export async function incrementTodayScanCount(): Promise<number> {
  try {
    const currentCount = await loadTodayScanCount();
    const nextCount = currentCount + 1;

    const usage: ScanUsage = {
      dateKey: getTodayKey(),
      count: nextCount,
    };

    await AsyncStorage.setItem(SCAN_USAGE_KEY, JSON.stringify(usage));

    return nextCount;
  } catch (error) {
    console.error("Failed to increment scan usage:", error);
    return 0;
  }
}

export async function resetTodayScanCount() {
  try {
    await AsyncStorage.removeItem(SCAN_USAGE_KEY);
  } catch (error) {
    console.error("Failed to reset scan usage:", error);
  }
}