import { Platform } from "react-native";

const LAPTOP_IP_ADDRESS = "192.168.0.10";

export const API_BASE_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8001"
    : `http://${LAPTOP_IP_ADDRESS}:8001`;