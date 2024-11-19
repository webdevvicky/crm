import React from "react";
import { Form, Input, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import apiService from "../api/apiService";
import { EntityName, ENTITIES } from "../constants/entities";

interface DynamicFieldsProps {
  entityName: EntityName; // Key to identify the entity from ENTITIES
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ entityName }) => {
  const fields = ENTITIES[entityName].fields;

  // Function to fetch options dynamically
  const fetchOptions = async (endpoint: string) => {
    const response = await apiService.get<{ label: string; value: string }[]>(
      endpoint
    );
    return response;
  };

  return (
    <>
      {fields.map((field) => {
        const { name, label, type, rules, optionsEndpoint } = field;

        switch (type) {
          case "text":
            return (
              <Form.Item key={name} name={name} label={label} rules={rules}>
                <Input placeholder={`Enter ${label}`} />
              </Form.Item>
            );
          case "email":
            return (
              <Form.Item key={name} name={name} label={label} rules={rules}>
                <Input placeholder={`Enter ${label}`} type="email" />
              </Form.Item>
            );
          case "textarea":
            return (
              <Form.Item key={name} name={name} label={label} rules={rules}>
                <Input.TextArea placeholder={`Enter ${label}`} />
              </Form.Item>
            );
          case "select":
            // Ensure the optionsEndpoint exists for select fields
            if (!optionsEndpoint) {
              console.error(
                `No optionsEndpoint provided for select field: ${name}`
              );
              return null;
            }

            // Fetch options dynamically using React Query
            const { data: options = [], isLoading } = useQuery({
              queryKey: [name, "options"],
              queryFn: () => fetchOptions(optionsEndpoint),
            });

            return (
              <Form.Item key={name} name={name} label={label} rules={rules}>
                <Select
                  placeholder={`Select ${label}`}
                  showSearch
                  loading={isLoading}
                  options={options} // Dynamically populated options
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicFields;
