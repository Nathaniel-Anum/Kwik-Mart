import {
  CrownOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Spin,
  Table,
  Tag,
  Form,
  Modal,
} from "antd";

import React, { useMemo, useState } from "react";
import { FaUser } from "react-icons/fa";
import api from "./utils/apiClient";
import Title from "antd/es/skeleton/Title";
import toast from "react-hot-toast";
import { Text } from "recharts";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  //getting users data
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api.get(
        "https://kwirkmart.expertech.dev/api/auth/admin/analytics/users/"
      ),
  });
  console.log(users?.data);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () =>
      api.get("https://kwirkmart.expertech.dev/api/auth/users/all/"),
  });

  //For search on table
  const filteredUsers = useMemo(() => {
    return customers?.data?.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers?.data, searchTerm]);

  const stats = [
    {
      title: "Total Users",
      count: users?.data?.totals?.active_users || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
    {
      title: "Verified Users",
      count: users?.data?.totals?.verified_users || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
    {
      title: "Unverified Users",
      count:
        users?.data?.totals?.active_users -
          (users?.data?.totals?.verified_users || 0) || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
    {
      title: "New Sign-ups (30d)",
      count: users?.data?.totals?.active_users || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
  ];
  const custs = [
    {
      title: "Customers",
      count: users?.data?.totals?.by_role?.customer || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
    {
      title: "Admins",
      count: users?.data?.totals?.by_role?.admin || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
    {
      title: "Moderators",
      count: users?.data?.totals?.by_role?.moderator || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
    {
      title: "Superusers",
      count: users?.data?.totals?.by_role?.superusers || 0,
      icon: <FaUser />,
      color: "bg-black",
    },
  ];

  const columns = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <span className="font-medium text-[16px]">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-[16px]">{text}</span>,
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => <span className="text-[16px]">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (verified) =>
        verified ? (
          <Tag color="green" className="px-3 py-1 text-[15px] rounded-full">
            Verified
          </Tag>
        ) : (
          <Tag color="volcano" className="px-3 py-1 text-[15px] rounded-full">
            Unverified
          </Tag>
        ),
    },
  ];

  const { mutate: createModerator } = useMutation({
    mutationFn: (data) =>
      api.post(
        "https://kwirkmart.expertech.dev/api/auth/create-moderator/",
        data
      ),
    onSuccess: (response) => {
      console.log("Moderator created:", response?.data);
      toast.success("Moderator created successfully!");
    },
    onError: (error) => {
      console.error("Error creating moderator:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create moderator"
      );
    },
  });

  const handleSubmit = (values) => {
    createModerator(values);
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111111", margin: 0 }}>Users</h1>
          <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0 }}>Manage customers and moderators</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create Moderator
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: "1.25rem" }}>
        {stats.map((item, index) => (
          <div
            key={index}
            className="km-stat-card"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>
                {item.title}
              </p>
              <h3 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 800, color: "#111111" }}>
                {item.count}
              </h3>
            </div>
            <div
              style={{
                width: "46px", height: "46px", borderRadius: "12px",
                background: "#111111",
                color: "#F5C100",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
              }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Role breakdown card */}
      <div className="km-page-card" style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111", marginBottom: "1rem" }}>
          Account Status Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {custs.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#f9f9f9",
                borderRadius: "12px",
                padding: "1rem 1.25rem",
                border: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>{item.title}</p>
                <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#111111" }}>{item.count}</h3>
              </div>
              <div
                style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "#F5C100", color: "#111111",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
                }}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="km-page-card">
        <div style={{ marginBottom: "1rem" }}>
          <Input.Search
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>

      <Modal
        title="Create Moderator"
        open={isModalOpen}
        centered
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        width={540}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit} style={{ marginTop: "1rem" }}>
          {/* First & Last Name Side by Side */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <Form.Item
              name="first_name"
              label="First Name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input placeholder="John" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </div>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="user@gmail.com" />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input placeholder="0240000000" />
          </Form.Item>

          {/* Password & Confirm Password Side by Side */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <Form.Item
              name="password"
              label="Password"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              style={{ flex: 1 }}
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="km-btn km-btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="km-btn km-btn-primary"
            >
              Create Moderator
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
