import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import {
  IS_SUPABASE_CONFIGURED,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from "@/src/api/supabaseConfig";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export async function checkSupabaseConnection() {
  if (!IS_SUPABASE_CONFIGURED) {
    return {
      ok: false,
      message: "Supabase is not configured yet.",
    };
  }

  try {
    const { error } = await supabase.auth.getSession();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    return {
      ok: true,
      message: "Supabase client is connected.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Could not connect to Supabase.",
    };
  }
}