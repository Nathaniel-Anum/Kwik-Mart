import { Table, Tag, Space, Button } from "antd";
import { useState } from "react";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      key: "1",
      orderId: "ORD001",
      customer: "John Doe",
      status: "Pending",
      paymentMethod: "Credit Card",
      date: "2024-02-20",
      totalPrice: "$250.00",
      itemsCount: 3,
    },
    {
      key: "2",
      orderId: "ORD002",
      customer: "Jane Smith",
      status: "Shipped",
      paymentMethod: "PayPal",
      date: "2024-02-19",
      totalPrice: "$125.50",
      itemsCount: 2,
    },
    {
      key: "3",
      orderId: "ORD003",
      customer: "Michael Johnson",
      status: "Delivered",
      paymentMethod: "Bank Transfer",
      date: "2024-02-18",
      totalPrice: "$320.00",
      itemsCount: 5,
    },
    {
      key: "4",
      orderId: "ORD004",
      customer: "Emma Wilson",
      status: "Canceled",
      paymentMethod: "Cash on Delivery",
      date: "2024-02-17",
      totalPrice: "$89.99",
      itemsCount: 1,
    },
    {
      key: "5",
      orderId: "ORD005",
      customer: "Chris Brown",
      status: "Pending",
      paymentMethod: "Credit Card",
      date: "2024-02-16",
      totalPrice: "$150.75",
      itemsCount: 4,
    },
    {
      key: "6",
      orderId: "ORD006",
      customer: "Olivia Davis",
      status: "Shipped",
      paymentMethod: "PayPal",
      date: "2024-02-15",
      totalPrice: "$205.30",
      itemsCount: 3,
    },
    {
      key: "7",
      orderId: "ORD007",
      customer: "Ethan Martinez",
      status: "Delivered",
      paymentMethod: "Credit Card",
      date: "2024-02-14",
      totalPrice: "$400.00",
      itemsCount: 6,
    },
    {
      key: "8",
      orderId: "ORD008",
      customer: "Sophia Anderson",
      status: "Pending",
      paymentMethod: "Bank Transfer",
      date: "2024-02-13",
      totalPrice: "$175.20",
      itemsCount: 2,
    },
  ]);

  const getStatusTag = (status) => {
    const colors = {
      Pending: "orange",
      Shipped: "blue",
      Delivered: "green",
      Canceled: "red",
    };
    return <Tag color={colors[status]}>{status}</Tag>;
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Shipped", value: "Shipped" },
        { text: "Delivered", value: "Delivered" },
        { text: "Canceled", value: "Canceled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) =>
        parseFloat(a.totalPrice.replace("$", "")) -
        parseFloat(b.totalPrice.replace("$", "")),
    },
    {
      title: "Items",
      dataIndex: "itemsCount",
      key: "itemsCount",
      sorter: (a, b) => a.itemsCount - b.itemsCount,
    }
  ];

  return (
    <div className="p-6 ml-[15rem]">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <Table
        columns={columns}
        dataSource={orders}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Orders;
