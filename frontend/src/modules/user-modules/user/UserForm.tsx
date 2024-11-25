import React from "react";
import { Form, Input } from "antd";
import FormWrapper from "../../../components/FormWrapper";

import FetchableSelect from "../../../components/FetchableSelect";

interface UsersFormProps {
  id?: string; // Optional ID for editing
  onSuccess: () => void; // Callback for success
}

const UserForm: React.FC<UsersFormProps> = ({ id, onSuccess }) => {
  return (
    <FormWrapper id={id} entityName="users" onSuccess={onSuccess}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="roles" label="Role">
        <FetchableSelect
          queryKey={["role", "options"]}
          url="roles/options"
          placeholder="Select permissions"
        />
      </Form.Item>

      <Form.Item name="teams" label="Teams">
        <FetchableSelect
          queryKey={["team", "options"]}
          url="teams/options"
          placeholder="Select Teams"
          mode="multiple"
        />
      </Form.Item>
    </FormWrapper>
  );
};

export default UserForm;
