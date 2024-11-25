import React from "react";
import { Form, Input, Checkbox, Row, Col, Typography } from "antd";
import FormWrapper from "../../../components/FormWrapper";
import { useFetch } from "../../../hooks/useFetch";

interface UsersFormProps {
  id?: string; // Optional ID for editing
  onSuccess: () => void; // Callback for success
}

interface ComponentProps {
  value: string;
  label: string;
}
const RoleForm: React.FC<UsersFormProps> = ({ id, onSuccess }) => {
  const { data: components } = useFetch<ComponentProps[]>(
    [id ? id : ""],
    "components/options"
  );

  const actions = [
    "view",
    "create",
    "edit",
    // "verify",
    // "reject",
    // "approve",
    "delete",
  ];

  return (
    <FormWrapper onSuccess={onSuccess} id={id} entityName="roles">
      <Form.Item
        name="name"
        label="Role Name"
        rules={[{ required: true, message: "Please enter the role name" }]}
      >
        <Input placeholder="Enter role name" />
      </Form.Item>

      {/* Permissions Section */}
      <Typography.Title level={5}>Permissions</Typography.Title>
      {components?.map((component, index) => (
        <Row key={component.value} gutter={16} style={{ marginBottom: 16 }}>
          {/* Component Name */}
          <Col span={6}>
            <strong>{component.label}</strong>
          </Col>

          {/* Actions Checkboxes */}
          <Col span={18}>
            <Form.Item
              name={["permissions", index, "actions"]}
              // rules={[
              //   {
              //     required: true,
              //     type: "array",
              //     message: `Please select at least one action for ${component.label}`,
              //   },
              // ]}
              initialValue={[]} // Default empty array for actions
            >
              <Checkbox.Group
                options={actions.map((action) => ({
                  label: action,
                  value: action,
                }))}
              />
            </Form.Item>

            {/* Hidden Fields for componentId, state, and description */}
            <Form.Item
              name={["permissions", index, "componentId"]}
              initialValue={component.value}
              hidden
            >
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name={["permissions", index, "state"]}
              initialValue={0}
              hidden
            >
              <Input type="hidden" />
            </Form.Item>
            <Form.Item
              name={["permissions", index, "description"]}
              initialValue={component.label}
              hidden
            >
              <Input type="hidden" />
            </Form.Item>
          </Col>
        </Row>
      ))}
    </FormWrapper>
  );
};

export default RoleForm;
