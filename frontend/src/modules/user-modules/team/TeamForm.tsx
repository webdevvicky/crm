import { Form, Input } from "antd";
import FormWrapper from "../../../components/FormWrapper";
interface TeamsFormProps {
  id?: string; // Optional ID for editing
  onSuccess: () => void; // Callback for success
}
const TeamForm: React.FC<TeamsFormProps> = ({ id, onSuccess }) => {
  return (
    <FormWrapper id={id} onSuccess={onSuccess} entityName="teams">
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </FormWrapper>
  );
};

export default TeamForm;
