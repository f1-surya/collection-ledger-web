import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshPromise: Promise<string> | null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        refreshPromise = refreshTokens();
        isRefreshing = true;
      }

      try {
        await refreshPromise;

        const newAccessToken = sessionStorage.accessToken;
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (e) {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        toast("Your session has expired, please login again.");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }
    return Promise.reject(error);
  },
);

const refreshTokens = async () => {
  const refreshToken = sessionStorage.refreshToken;
  if (!refreshToken) {
    throw new Error("No refresh token found!");
  }

  const res = await api.post("/auth/refresh", { token: refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = res.data;
  sessionStorage.accessToken = accessToken;
  sessionStorage.refreshToken = newRefreshToken;
  return accessToken;
};

export default api;
