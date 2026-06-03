import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = "https://dydhxjivsxexalzojiih.supabase.co";
const supabaseAnonKey = "sb_publishable_zbk6Q-cbgN1B_MQiOSwr-Q_nnmKfvAR";

const memoryStorage = {
  storage: new Map<string, string>(),

  async getItem(key: string) {
    return this.storage.get(key) ?? null;
  },

  async setItem(key: string, value: string) {
    this.storage.set(key, value);
  },

  async removeItem(key: string) {
    this.storage.delete(key);
  },
};

function getSupabaseStorage() {
  if (Platform.OS !== "web") {
    return AsyncStorage;
  }

  if (typeof window !== "undefined" && window.localStorage) {
    return {
      async getItem(key: string) {
        return window.localStorage.getItem(key);
      },

      async setItem(key: string, value: string) {
        window.localStorage.setItem(key, value);
      },

      async removeItem(key: string) {
        window.localStorage.removeItem(key);
      },
    };
  }

  return memoryStorage;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: getSupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});