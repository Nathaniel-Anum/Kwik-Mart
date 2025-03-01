import { Table, Tag, Space, Button } from "antd";
import { useState } from "react";
import { EyeOutlined, RedoOutlined, DeleteOutlined } from "@ant-design/icons";

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      key: "1",
      transactionId: "TXN001",
      customer: "John Doe",
      amount: "$250.00",
      paymentMethod: "Credit Card",
      status: "Success",
      date: "2024-02-20",
      reference: "REF12345",
    },
    {
      key: "2",
      transactionId: "TXN002",
      customer: "Jane Smith",
      amount: "$125.50",
      paymentMethod: "PayPal",
      status: "Pending",
      date: "2024-02-19",
      reference: "REF67890",
    },
    {
      key: "3",
      transactionId: "TXN003",
      customer: "Michael Johnson",
      amount: "$320.00",
      paymentMethod: "Bank Transfer",
      status: "Failed",
      date: "2024-02-18",
      reference: "REF11122",
    },
    {
      key: "4",
      transactionId: "TXN004",
      customer: "Emma Wilson",
      amount: "$89.99",
      paymentMethod: "Cash on Delivery",
      status: "Refunded",
      date: "2024-02-17",
      reference: "REF33344",
    },
    {
      key: "5",
      transactionId: "TXN005",
      customer: "Chris Brown",
      amount: "$150.75",
      paymentMethod: "Credit Card",
      status: "Success",
      date: "2024-02-16",
      reference: "REF55566",
    },
    {
      key: "6",
      transactionId: "TXN006",
      customer: "Olivia Davis",
      amount: "$205.30",
      paymentMethod: "PayPal",
      status: "Pending",
      date: "2024-02-15",
      reference: "REF77788",
    },
    {
      key: "7",
      transactionId: "TXN007",
      customer: "Ethan Martinez",
      amount: "$400.00",
      paymentMethod: "Credit Card",
      status: "Success",
      date: "2024-02-14",
      reference: "REF99900",
    },
    {
      key: "8",
      transactionId: "TXN008",
      customer: "Sophia Anderson",
      amount: "$175.20",
      paymentMethod: "Bank Transfer",
      status: "Failed",
      date: "2024-02-13",
      reference: "REF11223",
    },
  ]);

  const getStatusTag = (status) => {
    const colors = {
      Success: "green",
      Pending: "orange",
      Failed: "red",
      Refunded: "blue",
    };
    return <Tag color={colors[status]}>{status}</Tag>;
  };

  const columns = [
    // {
    //   title: "Transaction ID",
    //   dataIndex: "transactionId",
    //   key: "transactionId",
    //   sorter: (a, b) => a.transactionId.localeCompare(b.transactionId),
    // },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) =>
        parseFloat(a.amount.replace("$", "")) -
        parseFloat(b.amount.replace("$", "")),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Success", value: "Success" },
        { text: "Pending", value: "Pending" },
        { text: "Failed", value: "Failed" },
        { text: "Refunded", value: "Refunded" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
  ];

  return (
    <div className="p-6 ml-[15rem]">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>
      <Table
        columns={columns}
        dataSource={transactions}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default Transactions;
