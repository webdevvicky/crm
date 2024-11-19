import React, { useEffect } from "react";
import { Form, Button, Spin } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiService from "../api/apiService";
import { EntityName, ENTITIES } from "../constants/entities";
import { successHandler } from "../utils/notificationHandlers";
import { useParams } from "react-router-dom";

interface FormWrapperProps<T extends object | undefined> {
  id?: string;
  entityName: EntityName;
  children: React.ReactNode;
  onSuccess?: () => void;
}

const FormWrapper = <T extends object | undefined>({
  entityName,
  children,
  onSuccess,
}: FormWrapperProps<T>) => {
  const [form] = Form.useForm();
  const endpoint = ENTITIES[entityName].endpoint;
  const { id } = useParams();

  const { data, isFetching } = useQuery({
    queryKey: [endpoint, id],
    queryFn: async () => {
      if (!id) return null; // If no ID, skip fetch
      return apiService.get<T>(`/${endpoint}/${id}`);
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async (values: T) =>
      id
        ? apiService.put<T>(`/${endpoint}/${id}`, values)
        : apiService.post<T>(`/${endpoint}`, values),
    onSuccess: () => {
      form.resetFields();
      successHandler(
        id
          ? `${ENTITIES[entityName].displayName} updated successfully`
          : `${ENTITIES[entityName].displayName} created successfully`
      );
      onSuccess?.();
    },
  });

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  const onFinish = (values: T) => {
    console.log("Form Data Submitted:", values); // Log the form data
    mutation.mutate(values); // Trigger the mutation
  };

  if (isFetching)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      {children}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          disabled={mutation.isPending}
        >
          {id
            ? `Update ${ENTITIES[entityName].displayName}`
            : `Create ${ENTITIES[entityName].displayName}`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormWrapper;
