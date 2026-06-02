export const SUPABASE_URL = "https://dydhxjivsxexalzojiih.supabase.co";

export const SUPABASE_ANON_KEY =
  "sb_publishable_zbk6Q-cbgN1B_MQiOSwr-Q_nnmKfvAR";

export const IS_SUPABASE_CONFIGURED =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_URL.includes("PASTE_YOUR") &&
  !SUPABASE_ANON_KEY.includes("PASTE_YOUR");