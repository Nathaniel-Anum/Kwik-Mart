import React, { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  Tooltip,
  Popover,
  Image,
  Card,
  Typography,
  Badge,
  Divider,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../Pages/utils/apiClient"; // adjust path
import toast from "react-hot-toast";

const { Text, Title } = Typography;

const OrdersTable = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const queryClient = useQueryClient();

  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/v1/list/"), // adjust endpoint as needed
  });

  // Handle different response formats
  const orders = React.useMemo(() => {
    if (!ordersResponse) return [];

    // If the response is directly an array
    if (Array.isArray(ordersResponse)) {
      return ordersResponse;
    }

    // If the response has a data property
    if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
      return ordersResponse.data;
    }

    // If the response has results property (pagination)
    if (ordersResponse.results && Array.isArray(ordersResponse.results)) {
      return ordersResponse.results;
    }

    // If it's a single object, wrap it in an array
    if (typeof ordersResponse === "object") {
      return [ordersResponse];
    }

    return [];
  }, [ordersResponse]);

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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      Processing: "blue",
      Completed: "green",
      Cancelled: "red",
      Pending: "orange",
      Shipped: "cyan",
      Delivered: "green",
    };
    return colors[status] || "default";
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    const colors = {
      Paid: "green",
      Pending: "orange",
      Failed: "red",
      Refunded: "purple",
    };
    return colors[status] || "default";
  };

  // Order items popover content
  const getOrderItemsContent = (orderItems) => (
    <div style={{ maxWidth: 400, maxHeight: 300, overflowY: "auto" }}>
      <Title level={5} style={{ marginBottom: 12 }}>
        Order Items ({orderItems.length})
      </Title>
      {orderItems.map((item, index) => (
        <Card
          key={index}
          size="small"
          style={{ marginBottom: 8 }}
          bodyStyle={{ padding: "8px 12px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Image
              src={item.product_details.product_image}
              alt={item.product_details.name}
              width={40}
              height={40}
              style={{ objectFit: "cover", borderRadius: 4 }}
              fallback="data:image/png;base64,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"
            />
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: 12, display: "block" }}>
                {item.product_details.name}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>
                Qty: {item.quantity} × ${item.price_at_purchase}
              </Text>
              <div style={{ marginTop: 4 }}>
                <Text strong style={{ fontSize: 12, color: "#52c41a" }}>
                  ${item.subtotal}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      return await api.patch(`/v1/${orderId}/cancel/`);
    },
    onSuccess: () => {
      toast.success("Order cancelled successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to cancel order. Please try again.");
    },
  });

  const handleCancel = (orderId) => {
    console.log(orderId);
    cancelOrderMutation.mutate(orderId);
  };

  // Table columns
  const columns = [
    // {
    //   title: "Order ID",
    //   dataIndex: "order_id",
    //   key: "order_id",
    //   width: 120,
    //   ...getColumnSearchProps("order_id", "Order ID"),
    //   render: (text) => (
    //     <Tooltip title={text}>
    //       <Text code style={{ fontSize: 11 }}>
    //         {text.substring(0, 8)}...
    //       </Text>
    //     </Tooltip>
    //   ),
    // },
    // {
    {
      title: "Customer",
      dataIndex: "placed_by",
      key: "placed_by",
      width: 100,
      ...getColumnSearchProps("placed_by", "Customer"),
      render: (customerId) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text>{customerId}</Text>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      width: 140,
      sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CalendarOutlined style={{ color: "#52c41a" }} />
          <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
        </div>
      ),
    },
    {
      title: "Items",
      dataIndex: "order_items",
      key: "order_items",
      width: 80,
      align: "center",
      render: (orderItems) => (
        <Popover
          content={getOrderItemsContent(orderItems)}
          title="Order Details"
          trigger="hover"
          placement="rightTop"
        >
          <Badge count={orderItems.length} showZero>
            <Button
              type="text"
              icon={<ShoppingCartOutlined />}
              style={{ border: "1px solid #d9d9d9" }}
            />
          </Badge>
        </Popover>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: "Processing", value: "Processing" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
        { text: "Pending", value: "Pending" },
        { text: "Shipped", value: "Shipped" },
        { text: "Delivered", value: "Delivered" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontSize: 11 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Payment",
      dataIndex: "payment_status",
      key: "payment_status",
      width: 100,
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Pending", value: "Pending" },
        { text: "Failed", value: "Failed" },
        { text: "Refunded", value: "Refunded" },
      ],
      onFilter: (value, record) => record.payment_status === value,
      render: (paymentStatus) => (
        <Tag
          color={getPaymentStatusColor(paymentStatus)}
          style={{ fontSize: 11 }}
        >
          {paymentStatus}
        </Tag>
      ),
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      width: 120,
      ...getColumnSearchProps("payment_method", "Payment Method"),
      render: (method) => <Text style={{ fontSize: 12 }}>{method}</Text>,
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 110,
      sorter: (a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount),
      render: (amount, record) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <DollarOutlined style={{ color: "#52c41a", fontSize: 12 }} />
            <Text strong style={{ color: "#52c41a", fontSize: 13 }}>
              ${amount}
            </Text>
          </div>
          {parseFloat(record.discount_amount) > 0 && (
            <Text type="secondary" style={{ fontSize: 10 }}>
              Discount: ${record.discount_amount}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Cancel Order"
            description="Are you sure you want to cancel this order?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleCancel(record.order_id)}
          >
            <Tooltip title="Cancel Order">
              <Button
                type="text"
                icon={<CloseOutlined style={{ color: "red" }} />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <Text type="danger">Error loading orders: {error.message}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }} className="ml-[15rem]">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>

      <Table
        columns={columns}
        dataSource={orders || []}
        loading={isLoading}
        rowKey="order_id"
        scroll={{ x: 1200, y: 600 }}
        pagination={{
          total: orders?.length || 0,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} orders`,
        }}
        size="small"
        bordered
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default OrdersTable;
