import React, { useState } from "react";
import { Table, Input, Button, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { ENTITIES, EntityName } from "../constants/entities";
import apiService from "../api/apiService";
import { errorHandler } from "../utils/notificationHandlers";

interface TableWrapperProps {
  entityName: EntityName;
  columns: any[];
  filters?: object;
  onRowClick?: (record: any) => void;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
  entityName,
  columns,
  filters = {},
  onRowClick,
}) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const endpoint = ENTITIES[entityName].endpoint;

  const { data, isLoading, isError } = useQuery(
    [endpoint, currentPage, searchText, filters],
    () =>
      apiService.get(`/${endpoint}`, {
        params: { page: currentPage, search: searchText, ...filters },
      }),
    {
      keepPreviousData: true,
      onError: (error) => {
        errorHandler(error); // Trigger error notification
      },
    }
  );

  const handleSearch = () => setCurrentPage(1);

  if (isLoading)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  if (isError) return <div>Error fetching data. Please try again.</div>;

  return (
    <div>
      <Input
        placeholder={`Search ${ENTITIES[entityName].pluralDisplayName}`}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button type="primary" onClick={handleSearch}>
        Search
      </Button>
      <Table
        dataSource={data?.items}
        columns={columns}
        pagination={{
          current: currentPage,
          total: data?.total,
          pageSize: 10,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
        })}
        bordered
      />
    </div>
  );
};

export default TableWrapper;
