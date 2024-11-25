import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { successHandler, errorHandler } from "../utils/notificationHandlers";

export const useMutate = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>, // API call function
  queryKeyToRefetch?: string[], // Optional query key to refetch
  options?: UseMutationOptions<TData, unknown, TVariables> // React Query mutation options
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      successHandler("successful!"); // Show success notification

      // Refetch the associated query if queryKeyToRefetch is provided
      if (queryKeyToRefetch) {
        queryClient.invalidateQueries({ queryKey: queryKeyToRefetch });
      }


      // Call the custom onSuccess callback if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      errorHandler(data); // Show error notification

      // Call the custom onError callback if provided
      options?.onError?.(data, variables, context);
    },
    ...options, // Spread any additional options provided
  });
};
