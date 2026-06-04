import { Platform } from "react-native";

/**
 * API environment:
 *
 * local:
 * - Phone uses your laptop Wi-Fi IP.
 * - Browser uses 127.0.0.1.
 *
 * production:
 * - App uses deployed Render backend.
 */
export const API_ENV = "production" as "local" | "production";

/**
 * Your laptop Wi-Fi IP address.
 * Only used when API_ENV = "local".
 */
const LAPTOP_IP_ADDRESS = "192.168.0.10";

/**
 * Deployed Render backend URL.
 */
const PRODUCTION_API_BASE_URL = "https://nutrisnap-ai-akgy.onrender.com";

const LOCAL_API_BASE_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8001"
    : `http://${LAPTOP_IP_ADDRESS}:8001`;

export const API_BASE_URL =
  API_ENV === "production" ? PRODUCTION_API_BASE_URL : LOCAL_API_BASE_URL;

export const API_CONFIG_LABEL =
  API_ENV === "production" ? "Production API" : "Local development API";
  