import React, { useEffect } from "react";
import { Select, Spin } from "antd";
import { useFetch } from "../hooks/useFetch";

interface FetchableSelectProps {
  queryKey: string[]; // Unique key for React Query
  url: string; // API endpoint
  placeholder?: string; // Placeholder for the Select
  mode?: "multiple" | "tags"; // Multi-select mode
  value?: string[] | string; // Controlled value
  defaultValue?: string[] | string; // Default value for editing
  params?: object; // Optional query params
  onChange?: (value: string | string[]) => void; // Change handler
}

const FetchableSelect: React.FC<FetchableSelectProps> = ({
  queryKey,
  url,
  placeholder = "Select an option",
  mode,
  value,
  defaultValue,
  params,
  onChange,
}) => {
  const { data, isLoading, refetch } = useFetch<
    { label: string; value: string }[]
  >(queryKey, url, params);

  // Ensure default value is included in options
  useEffect(() => {
    if (defaultValue && data && Array.isArray(data)) {
      const defaultArray = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];
      const missingValues = defaultArray.filter(
        (val) => !data.find((option) => option.value === val)
      );

      if (missingValues.length > 0) {
        refetch(); // Ensure missing values are fetched if not already present
      }
    }
  }, [defaultValue, data, refetch]);

  return (
    <Select
      showSearch
      placeholder={placeholder}
      mode={mode}
      value={value}
      onChange={onChange}
      options={data || []} // Use fetched data directly
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      notFoundContent={isLoading ? <Spin size="small" /> : "No options found"}
    />
  );
};

export default FetchableSelect;
