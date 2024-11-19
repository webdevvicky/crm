import React, { useState } from "react";
import { Button, Modal, Table } from "antd";
import { useDispatch } from "react-redux";
import { openModal } from "../store/modalSlice";
import UsersForm from "./UsersForm";

const UsersPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const handleCreate = () => {
    setOpen(true);
  };

  const handleEdit = (id: string) => {
    console.log(id);
  };

  return (
    <div>
      <Button type="primary" onClick={handleCreate}>
        Create User
      </Button>
      <Table
        dataSource={[
          { id: "1", username: "John Doe", email: "john@example.com" },
          { id: "2", username: "Jane Smith", email: "jane@example.com" },
        ]}
        columns={[
          {
            title: "Username",
            dataIndex: "username",
            key: "username",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
          },
          {
            title: "Actions",
            render: (record: any) => (
              <>
                <Button type="link" onClick={() => handleEdit(record.id)}>
                  Edit
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
      />
      <Modal
        width={800}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        cancelText="Close"
        closable
        maskClosable
      >
        <UsersForm />
      </Modal>
    </div>
  );
};

export default UsersPage;
