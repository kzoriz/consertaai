import axios from "axios";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000/api"
    : "http://143.14.178.54/api-consertaai";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;