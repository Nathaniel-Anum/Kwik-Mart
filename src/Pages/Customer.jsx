import React, { useState } from "react";
import { Button, Input, Space, Table, Tag } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import api from "../Pages/utils/apiClient";
import { SearchOutlined } from "@ant-design/icons";

const Customer = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api.get("/auth/users/all/"),
  });

  // Search functionality
  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters();
    setSearchText("");
    setSearchedColumn("");
    confirm();
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      ...getColumnSearchProps("email", "Email"),
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      width: 200,
      ...getColumnSearchProps("full_name", "Full Name"),
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150,
      render: (phone) =>
        phone || <span style={{ color: "#999" }}>Not provided</span>,
    },
    {
      title: "Verification Status",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 150,
      render: (isVerified) => (
        <Tag color={isVerified ? "green" : "orange"}>
          {isVerified ? "Verified" : "Pending"}
        </Tag>
      ),
      filters: [
        { text: "Verified", value: true },
        { text: "Pending", value: false },
      ],
      onFilter: (value, record) => record.is_verified === value,
    },
    {
      title: "User Type",
      key: "user_type",
      width: 120,
      render: (_, record) => (
        <Tag color={record.superuser ? "blue" : "default"}>
          {record.superuser ? "Admin" : "User"}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: true },
        { text: "User", value: false },
      ],
      onFilter: (value, record) => !!record.superuser === value,
    },
  ];

  if (error) {
    return <div>Error loading customers: {error.message}</div>;
  }

  return (
    <div className="ml-[15rem]">
      <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <Table
        columns={columns}
        dataSource={customers?.data}
        rowKey="id" // Use id as the key but don't display it
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} customers`,
          pageSizeOptions: ["10", "20", "50"],
        }}
        scroll={{ x: 800 }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default Customer;
