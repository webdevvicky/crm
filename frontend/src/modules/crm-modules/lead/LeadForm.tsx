import React, { useState } from "react";
import { Steps, Form, Input, Select, DatePicker, Button, message } from "antd";
import FormWrapper from "../../../components/FormWrapper";

const { Step } = Steps;

interface LeadFormProps {
  id?: string; // Optional ID for editing
  onSuccess: () => void; // Callback for success
}

const LeadForm: React.FC<LeadFormProps> = ({ id, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const steps = [
    {
      title: "Basic Information",
      content: (
        <>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please enter the lead's name" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="company" label="Company">
            <Input placeholder="Enter company name" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Lead Details",
      content: (
        <>
          <Form.Item
            name="source"
            label="Source"
            rules={[{ required: true, message: "Please select a source" }]}
          >
            <Select placeholder="Select source">
              <Select.Option value="website">Website</Select.Option>
              <Select.Option value="referral">Referral</Select.Option>
              <Select.Option value="ad_campaign">Ad Campaign</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="campaign" label="Campaign">
            <Input placeholder="Enter campaign name (optional)" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select priority" }]}
          >
            <Select placeholder="Select priority">
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="deadline" label="Deadline">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Custom Fields",
      content: (
        <>
          <Form.Item name={["customFields", "region"]} label="Region">
            <Input placeholder="Enter region" />
          </Form.Item>
          <Form.Item name={["customFields", "budget"]} label="Budget">
            <Input placeholder="Enter budget" type="number" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Tasks",
      content: (
        <Form.Item name="tasks" label="Tasks">
          <Input.TextArea placeholder="Enter tasks (comma-separated)" />
        </Form.Item>
      ),
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (values: any) => {
    console.log("Form Submitted: ", values);
    onSuccess();
    message.success("Lead saved successfully!");
  };

  return (
    <FormWrapper id={id} key={id} onSuccess={onSuccess} entityName="leads">
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>

     
        {steps[currentStep].content}

        <div style={{ marginTop: 20 }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: 8 }} onClick={prev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
         
        </div>
   
    </FormWrapper>
  );
};

export default LeadForm;
