import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import apiService from "../api/apiService";
import { errorHandler } from "../utils/notificationHandlers";

export const useFetch = <T>(
  queryKey: string[], // Unique React Query key
  url: string, // API endpoint
  params?: object, // Optional query params
  options?: UseQueryOptions<T> // React Query options
) => {
  return useQuery<T>({
    queryKey, // Pass the key
    queryFn: async () => {
      try {
        // Call API and return data
        return await apiService.get<T>(url, params);
      } catch (error) {
        // Handle errors
        errorHandler(error);
        throw error;
      }
    },
    ...options, // Spread additional options
  });
};
