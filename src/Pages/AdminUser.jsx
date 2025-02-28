import React from "react";
import { Table, Tag } from "antd";

const AdminUsers = () => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "blue" : "green"}>{role}</Tag>
      ),
    },
  ];

  const data = [
    { key: 1, name: "John Doe", role: "Admin" },
    { key: 2, name: "Jane Smith", role: "Moderator" },
    { key: 3, name: "Alice Johnson", role: "Admin" },
    { key: 4, name: "Bob Brown", role: "Moderator" },
  ];

  return (
    <div className="ml-[15rem]">
      <h1 className="text-2xl font-semibold mb-4">Admin Users</h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default AdminUsers;
