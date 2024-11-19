import React from "react";
import FormWrapper from "../components/FormWrapper";
import { Form, Input } from "antd";

const UsersForm: React.FC<{ id?: string; onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  return (
    <FormWrapper id={"1"} entityName="users" onSuccess={onSuccess}>
      <Form.Item name="name" label="Name">
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item name="email" label="Name">
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item name="mobileNumber" label="Name">
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item name="name" label="Name">
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item name="email" label="Name">
        <Input placeholder="Enter name" />
      </Form.Item>
      <Form.Item name="mobileNumber" label="Name">
        <Input placeholder="Enter name" />
        <Form.Item name="name" label="Name">
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item name="email" label="Name">
          <Input placeholder="Enter name" />
        </Form.Item>
        <Form.Item name="mobileNumber" label="Name">
          <Input placeholder="Enter name" />
        </Form.Item>
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input password!",
          },
          {
            min: 8,
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      {/* <Form.Item name="role" label="Role">
        <Select
          showSearch
          placeholder="Select a role"
          filterOption={(input: string, option: any) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: "1", label: "Jack" },
            { value: "2", label: "Lucy" },
            { value: "3", label: "Tom" },
          ]}
        />
      </Form.Item> */}
    </FormWrapper>
  );
};

export default UsersForm;
