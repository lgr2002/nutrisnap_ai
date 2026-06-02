import {
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
} from "@/src/storage/safeStorage";

const AUTH_EMAIL_KEY = "nutrisnap_auth_email_v1";

export async function saveAuthEmail(email: string) {
  await safeSetItem(AUTH_EMAIL_KEY, email);
}

export async function loadAuthEmail() {
  return safeGetItem(AUTH_EMAIL_KEY);
}

export async function clearAuthEmail() {
  await safeRemoveItem(AUTH_EMAIL_KEY);
}