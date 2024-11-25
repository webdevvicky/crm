import React, { useState } from "react";
import { Button, Table, Modal, Input, Dropdown, Col, Row } from "antd";
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useFetch } from "../hooks/useFetch";
import { useMutate } from "../hooks/useMutate";
import apiService from "../api/apiService";

interface GenericCrudPageProps<T> {
  entity: string; // Entity name (e.g., "users", "roles")
  columns: any[]; // Table columns
  FormComponent: React.ComponentType<{ id?: string; onSuccess: () => void }>; // Form component for add/edit
  InfoComponent?: React.ComponentType<{ id: string }>; // Optional info component for view
}

interface TableProps {
  data: [];
  total: number;
  page: number;
  pageSize: number;
}

const GenericCrudPage = <T extends { _id: string }>(
  props: GenericCrudPageProps<T>
) => {
  const { entity, columns, FormComponent, InfoComponent } = props;
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const queryClient = useQueryClient();

  // Fetch list data
  const { data, isLoading } = useFetch<TableProps>(
    [`${entity}`, pagination.current.toString(), searchTerm],
    entity,
    {
      page: pagination.current,
      limit: pagination.pageSize,
      filters: { name: searchTerm || undefined },
    }
  );

  const { mutate: deleteEntity } = useMutate<T, string>(
    (id) => apiService.delete(`${entity}/${id}`),
    [`${entity}`]
  );

  // Pagination and search handling
  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Modal actions
  const handleCreateOrEdit = (id?: string) => {
    setEditingId(id || null);
    setIsFormModalOpen(true);
  };

  const handleView = (id: string) => {
    setViewingId(id);
    setIsInfoModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: `Are you sure you want to delete this ${entity.slice(0, -1)}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => deleteEntity(id),
    });
  };

  // Enhance columns with dynamic actions
  const enhancedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_: any, record: T) => {
        const menuItems = [
          InfoComponent && {
            key: "view",
            label: (
              <span onClick={() => handleView(record._id)}>
                <i className="fas fa-eye" /> View
              </span>
            ),
          },
          {
            key: "edit",
            label: (
              <span onClick={() => handleCreateOrEdit(record._id)}>
                <i className="fas fa-edit" /> Edit
              </span>
            ),
          },
          {
            key: "delete",
            label: (
              <span onClick={() => handleDelete(record._id)}>
                <i className="fas fa-trash" /> Delete
              </span>
            ),
          },
        ].filter(Boolean);

        return (
          <Dropdown
            menu={{
              items: menuItems as any,
            }}
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
        {/* Left Section: Back Button and Title */}
        <Col>
          <Row align="middle" gutter={16}>
            <Col>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => window.history.back()}
              />
            </Col>
            <Col>
              <h2 style={{ margin: 0 }}>{`${entity.slice(0, -1)} List`}</h2>
            </Col>
          </Row>
        </Col>

        {/* Right Section: Search, Refresh, Add New */}
        <Col>
          <Row align="middle" gutter={16}>
            {/* Search */}
            <Col>
              <Input.Search
                placeholder={`Search ${entity}`}
                allowClear
                onChange={(e) => handleSearch(e.target.value)} // Ant Design's onSearch callback
                style={{ width: 200 }}
              />
            </Col>

            {/* Refresh */}
            <Col>
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: [entity] })
                }
              >
                Refresh
              </Button>
            </Col>

            {/* Add New */}
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleCreateOrEdit()}
              >
                Add New {entity.slice(0, -1)}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        bordered
        loading={isLoading}
        dataSource={data?.data || []}
        columns={enhancedColumns}
        rowKey="_id"
        pagination={{
          current: data?.page,
          pageSize: data?.pageSize,
          total: data?.total,
          onChange: handleTableChange,
        }}
        scroll={{ x: 1000 }}
      />
      {/* Form Modal */}
      <Modal
        title={
          editingId
            ? `Edit ${entity.slice(0, -1)}`
            : `Add ${entity.slice(0, -1)}`
        }
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <FormComponent
          id={editingId || undefined}
          onSuccess={() => {
            setIsFormModalOpen(false);
            queryClient.invalidateQueries({ queryKey: [entity] });
          }}
        />
      </Modal>
      {/* Info Modal */}
      {InfoComponent && (
        <Modal
          title={`${entity.slice(0, -1)} Info`}
          open={isInfoModalOpen}
          onCancel={() => setIsInfoModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          {viewingId && <InfoComponent id={viewingId} />}
        </Modal>
      )}
    </>
  );
};

export default GenericCrudPage;
