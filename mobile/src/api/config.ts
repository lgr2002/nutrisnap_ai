import { Platform } from "react-native";

/**
 * Change this depending on your testing mode.
 *
 * local:
 * - Phone uses your laptop Wi-Fi IP.
 * - Browser uses 127.0.0.1.
 *
 * production:
 * - App uses deployed backend URL.
 */
export const API_ENV = "local" as "local" | "production";

/**
 * Your laptop Wi-Fi IP address.
 *
 * To check on Windows:
 * ipconfig
 * Then find Wi-Fi IPv4 Address.
 */
const LAPTOP_IP_ADDRESS = "192.168.0.10";

/**
 * Later, after deployment, replace this with your real backend URL.
 *
 * Example:
 * https://nutrisnap-ai-backend.onrender.com
 */
const PRODUCTION_API_BASE_URL = "https://replace-this-after-deployment.com";

const LOCAL_API_BASE_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8001"
    : `http://${LAPTOP_IP_ADDRESS}:8001`;

export const API_BASE_URL =
  API_ENV === "production" ? PRODUCTION_API_BASE_URL : LOCAL_API_BASE_URL;

export const API_CONFIG_LABEL =
  API_ENV === "production" ? "Production API" : "Local development API";