import axios from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000/api"
    : "http://192.168.0.17:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;