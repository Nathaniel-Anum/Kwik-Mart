import React, { useMemo, useState } from "react";

import api from "../Pages/utils/apiClient";
import toast from "react-hot-toast";
import {
  Table,
  Tag,
  Button,
  Card,
  Drawer,
  List,
  Avatar,
  Space,
  Spin,
} from "antd";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const OrdersTable = () => {
  const queryClient = useQueryClient();

  // selected row (order_id)
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // helper: format ISO date into "DD MMM YYYY, HH:mm"
  function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function sumSubtotals(orderItems = []) {
    // subtotals are strings like "69.00"
    return orderItems.reduce(
      (acc, it) => acc + parseFloat(it.subtotal || 0),
      0
    );
  }

  function statusTag(status) {
    const s = (status || "").toLowerCase();
    if (s === "approved") return <Tag color="green">Approved</Tag>;
    if (s === "cancelled") return <Tag color="red">Cancelled</Tag>;
    if (s === "paid") return <Tag color="green">Paid</Tag>;
    if (s === "unpaid") return <Tag color="red">Unpaid</Tag>;
    // processing or default
    return <Tag color="gold">Processing</Tag>;
  }


  // ----- fetch orders (list) -----
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("https://kwirkmart.expertech.dev/api/v1/list/"),
    refetchOnWindowFocus: false,
  });

  // expected data shape: data?.data is array of orders
  const orders = useMemo(() => {
    // if API directly returns array, handle both shapes:
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    // fallback if server wraps differently
    return [];
  }, [data]);

  // ----- Approve mutation -----
  const approveMutation = useMutation({
    mutationFn: (orderId) => {
      const url = `https://kwirkmart.expertech.dev/api/v1/${orderId}/approve/`;
      return api.post(url);
    },
    onSuccess: () => {
      toast.success("Order approved");
      // refetch orders + detail
      queryClient.invalidateQueries(["orders"]);
      if (selectedOrderId) {
        queryClient.invalidateQueries(["order", selectedOrderId]);
      }
    },
    onError: (err) => {
      console.error(err?.response?.data?.error);
      toast.error(err?.response?.data?.error);
    },
  });

  // ----- Cancel mutation -----
  const cancelMutation = useMutation({
    mutationFn: (orderId) => {
      const url = `https://kwirkmart.expertech.dev/api/v1/${orderId}/cancel/`;
      return api.patch(url);
    },
    onSuccess: () => {
      toast.success("Order cancelled");
      queryClient.invalidateQueries(["orders"]);
      if (selectedOrderId) {
        queryClient.invalidateQueries(["order", selectedOrderId]);
      }
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to cancel order");
    },
  });

  // ----- fetch order detail on demand -----
  async function openOrderDetail(orderId) {
    setDrawerVisible(true);
    setOrderDetail(null);
    setDetailLoading(true);
    setSelectedOrderId(orderId);

    try {
      const res = await api.get(
        `https://kwirkmart.expertech.dev/api/v1/${orderId}/`
      );
      // If API returns object inside res.data or res.data.data, handle both:
      const payload = res.data?.data ?? res.data;
      setOrderDetail(payload);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order details");
    } finally {
      setDetailLoading(false);
    }
  }

  // ----- Table columns -----
  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      render: (id) => (
        <Tag style={{ cursor: "pointer" }} color="green">
          {id ? id.slice(0, 8) : "-"}
        </Tag>
      ),
    },
    {
      title: "Placed By",
      dataIndex: "placed_by",
      key: "placed_by",
      render: (t) => t || "-",
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      render: (d) => formatDate(d),
      sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
      defaultSortOrder: "descend",
    },
    {
      title: "Items",
      key: "items_count",
      render: (row) => (row.order_items ? row.order_items.length : 0),
      align: "center",
    },
    {
      title: "Total (GHS?)",
      key: "total",
      render: (row) => {
        const total = sumSubtotals(row.order_items || []);
        // show two decimal places
        return total.toFixed(2);
      },
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => statusTag(s),
      filters: [
        { text: "Processing", value: "processing" },
        { text: "Approved", value: "approved" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      align: "center",
    },
    {
      title: "Payment Stats",
      dataIndex: "payment_status",
      key: "payment_status",
  render: (s) => statusTag(s),
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Unpaid", value: "Unpaid" },
      ],
      onFilter: (value, record) => record.payment_status === value,
      align: "center",
  
    }
  ,
  ];

  // row selection (single)
  const rowSelection = {
    type: "checkbox", // Change to checkbox
    selectedRowKeys: selectedOrderId ? [selectedOrderId] : [],
    onChange: (selectedRowKeys) => {
      const id = selectedRowKeys[0] ?? null;
      setSelectedOrderId(id);
    },
    getCheckboxProps: (record) => ({
      disabled: record.status === "cancelled",
    }),
    // Force single selection
    onSelect: (record, selected, selectedRows) => {
      if (selected) {
        setSelectedOrderId(record.order_id);
      } else {
        setSelectedOrderId(null);
      }
    },
    // Prevent multiple selections
    hideSelectAll: true,
  };
  // approve/cancel handlers
  const handleApprove = async () => {
    if (!selectedOrderId) return toast.info("Select an order first");
    await approveMutation.mutateAsync(selectedOrderId);
  };
  const handleCancel = async () => {
    if (!selectedOrderId) return toast.info("Select an order first");
    await cancelMutation.mutateAsync(selectedOrderId);
  };

  // table onRow: clicking row opens detail (but not when clicking the radio checkbox)
  const onRow = (record) => {
    return {
      onClick: (e) => {
        // prevent row click when clicking on checkbox input
        // checkbox has a class 'ant-radio' or ant-table-selection-column, so skip clicks from those elements
        const tagName = e.target?.className || "";
        if (typeof tagName === "string" && tagName.includes("ant-radio")) {
          return;
        }
        if (
          typeof tagName === "string" &&
          tagName.includes("ant-table-selection-column")
        ) {
          return;
        }

        openOrderDetail(record.order_id);
      },
    };
  };

  return (
    <div className="p-4 ml-[15rem] min-h-screen ">
      <Card
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 className="text-2xl font-semibold p-2 mb-6">Orders</h2>
            <Space>
              <Button
                danger
                onClick={handleCancel}
                disabled={!selectedOrderId || cancelMutation.isLoading}
                loading={cancelMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleApprove}
                disabled={!selectedOrderId || approveMutation.isLoading}
                loading={approveMutation.isLoading}
              >
                Approve
              </Button>
            </Space>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin />
            </div>
          ) : isError ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              Failed to load orders
            </div>
          ) : (
            <Table
              rowKey="order_id"
              columns={columns}
              dataSource={orders}
              pagination={{ pageSize: 10 }}
              rowSelection={rowSelection}
              onRow={onRow}
              bordered={false}
            />
          )}
        </Space>

        {/* Drawer for order detail */}
        <Drawer
          title={
            orderDetail
              ? `Order #${orderDetail.order_id?.slice(0, 8)}`
              : "Order Details"
          }
          placement="right"
          width={620}
          onClose={() => {
            setDrawerVisible(false);
            setOrderDetail(null);
          }}
          open={drawerVisible}
          styles={{
            body: { padding: "20px 24px" },
          }}
        >
          {detailLoading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Spin size="large" />
            </div>
          ) : !orderDetail ? (
            <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
              No details to display
            </div>
          ) : (
            <>
              {/* Order Info */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ marginBottom: 8 }}>
                  <strong>Placed by:</strong> {orderDetail.placed_by}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Shipping Address:</strong>{" "}
                  {orderDetail.shipping_address}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Payment Status:</strong>{" "}
                  {statusTag(orderDetail.payment_status)}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Payment Method:</strong> {orderDetail.payment_method}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Order date:</strong>{" "}
                  {formatDate(orderDetail.order_date)}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Status:</strong> {statusTag(orderDetail.status)}
                </p>
              </div>

              {/* Items Section */}
              <h4 style={{ marginBottom: 12, fontWeight: 600 }}>Items</h4>
              <List
                itemLayout="horizontal"
                dataSource={orderDetail.order_items || []}
                split={false}
                renderItem={(item) => {
                  const pd = item.product_details || {};
                  const subtotal = parseFloat(item.subtotal || 0).toFixed(2);
                  return (
                    <List.Item
                      style={{
                        padding: "12px 0",
                        borderBottom: "1px solid #f1f1f1",
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          pd.product_image ? (
                            <Avatar
                              src={pd.product_image}
                              shape="square"
                              size={56}
                            />
                          ) : (
                            <Avatar shape="square" size={56}>
                              {(pd.name || "P")[0]}
                            </Avatar>
                          )
                        }
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600 }}>{pd.name}</div>
                              <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                                {pd.sub_category?.name}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", minWidth: 80 }}>
                              <div>Qty: {item.quantity}</div>
                              <div>₵ {subtotal}</div>
                            </div>
                          </div>
                        }
                        description={pd.slug}
                      />
                    </List.Item>
                  );
                }}
              />

              {/* Total */}
              <div
                style={{
                  marginTop: 24,
                  textAlign: "right",
                  fontSize: 16,
                  fontWeight: 600,
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: 16,
                }}
              >
                Total: ₵{" "}
                {sumSubtotals(orderDetail.order_items || []).toFixed(2)}
              </div>
            </>
          )}
        </Drawer>
      </Card>
    </div>
  );
};

export default OrdersTable;
