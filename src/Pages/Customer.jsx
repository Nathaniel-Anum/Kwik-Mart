import React from "react";
import { Table } from "antd";

const Customer = () => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
  ];

  const data = [
    {
      key: 1,
      name: "Emily White",
      email: "emily@example.com",
      phone: "123-456-7890",
      address: "123 Main St, NY",
    },
    {
      key: 2,
      name: "Michael Green",
      email: "michael@example.com",
      phone: "234-567-8901",
      address: "456 Elm St, CA",
    },
    {
      key: 3,
      name: "Sophia Black",
      email: "sophia@example.com",
      phone: "345-678-9012",
      address: "789 Oak St, TX",
    },
    {
      key: 4,
      name: "Daniel Blue",
      email: "daniel@example.com",
      phone: "456-789-0123",
      address: "101 Pine St, FL",
    },
  ];

  return (
    <div className="ml-[15rem]">
         <h1 className="text-2xl font-semibold mb-4">Customers</h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Customer;
