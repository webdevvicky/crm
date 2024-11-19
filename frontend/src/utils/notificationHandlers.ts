import { notification } from "antd";

// Success handler
export const successHandler = (message: string, description?: string) => {
  notification.success({
    message,
    description,
    placement: "topRight",
    duration: 3, // Auto close after 3 seconds
  });
};

// Error handler
export const errorHandler = (error: any) => {
  console.log(error);
  const description =
    error.response?.data?.message ||
    error.message ||
    error.response.data.error ||
    "Something went wrong. Please try again.";
  notification.error({
    message: "Error",
    description,
    placement: "topRight",
    duration: 3,
  });
};
