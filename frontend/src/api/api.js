import axios from "axios";

export const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export default api;
