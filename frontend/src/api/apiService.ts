import axios from "axios";
import { errorHandler } from "../utils/notificationHandlers";

const api = axios.create({
  baseURL: "http://localhost:5000/api/", // Replace with your base API URL
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage
  const fullDomain = "google.crm.in"; // Get the full domain (e.g., "google.crm.in")

  if (config.headers) {
    config.headers.set("domain", fullDomain); // Set the tenant domain
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`); // Set the Bearer token
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
    errorHandler(error); // Trigger global error notification
    return Promise.reject(error); // Re-throw the error for React Query to handle
  }
);

const apiService = {
  get: async <T>(url: string, params?: object): Promise<T> => {
    const response = await api.get(url, { params });
    return response.data;
  },
  post: async <T>(url: string, data?: object): Promise<T> => {
    const response = await api.post(url, data);
    return response.data;
  },
  patch: async <T>(url: string, data?: object): Promise<T> => {
    const response = await api.patch(url, data);
    return response.data;
  },
  put: async <T>(url: string, data?: object): Promise<T> => {
    const response = await api.put(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete(url);
    return response.data;
  },
};

export default apiService;
