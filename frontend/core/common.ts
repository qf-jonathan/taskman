import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

function isObject(value: unknown): boolean {
  return value !== null && typeof value === "object";
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data && isObject(config.data)) {
      config.data = snakecaseKeys(config.data, { deep: true });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && isObject(response.data)) {
      response.data = camelcaseKeys(response.data, { deep: true });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
