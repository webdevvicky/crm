import React from "react";
import { Card, Table, Collapse, Tag } from "antd";
import { useFetch } from "../../../hooks/useFetch";

interface ComponentId {
  _id: string;
  name: string;
  description: string;
}

interface Permission {
  componentId: ComponentId;
  actions: string[];
  state: number;
  description: string;
  _id: string;
}

interface RoleData {
  created: {
    user: string | null;
    date: string | null;
  };
  updated: {
    user: string | null;
    date: string | null;
  };
  approved?: {
    user: string | null;
    date: string | null;
  };
  verified?: {
    user: string | null;
    date: string | null;
  };
  deleted?: {
    user: string | null;
    date: string | null;
  };
  _id: string;
  name: string;
  permissions: Permission[];
  state: number;
  createdAt: string;
  updatedAt: string;
}

interface RoleInfoProps {
  id: string;
}

const RoleInfo: React.FC<RoleInfoProps> = ({ id }) => {
  const { data, isLoading, error } = useFetch<RoleData>(
    [id ? id : ""],
    `roles/${id}`
  );
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading role data.</div>;
  }

  if (!data) {
    return <div>No role data found.</div>;
  }

  const { name, permissions } = data;

  // Columns for the permissions table
  const columns = [
    {
      title: "Component Name",
      dataIndex: ["componentId", "name"],
      key: "componentName",
    },
    {
      title: "Description",
      dataIndex: ["componentId", "description"],
      key: "description",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (actions: string[]) =>
        actions.map((action) => (
          <Tag color="blue" key={action}>
            {action}
          </Tag>
        )),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state: number) => (
        <Tag color={state === 0 ? "green" : "red"}>
          {state === 0 ? "Active" : "Inactive"}
        </Tag>
      ),
    },
  ];

  return (
    <Card title={`Role: ${name}`} bordered>
      {/* <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Created By">
          {created?.user || "N/A"} on{" "}
          {created.date ? new Date(created.date).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated By">
          {updated.user || "N/A"} on{" "}
          {updated.date ? new Date(updated.date).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="State">
          <Tag color={state === 0 ? "green" : "red"}>
            {state === 0 ? "Active" : "Inactive"}
          </Tag>
        </Descriptions.Item>
      </Descriptions> */}

      <Collapse defaultActiveKey={["1"]} style={{ marginTop: "20px" }}>
        <Collapse.Panel header="Permissions" key="1">
          <Table
            dataSource={permissions}
            columns={columns}
            rowKey={(record) => record._id}
            pagination={false}
          />
        </Collapse.Panel>
      </Collapse>
    </Card>
  );
};

export default RoleInfo;
