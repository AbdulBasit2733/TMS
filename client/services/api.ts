import axios from "axios";
import { BASE_API_URL } from "@/lib/utils";

export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(original);
      } catch {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);