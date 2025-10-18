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
      console.log("✅ Moderator created:", response?.data);
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
    <div className="p-4 ml-[15rem] min-h-screen ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <div className="space-x-3">
          {/* New Coupon Button */}
          <Button
            icon={<PlusOutlined className="text-lg" />}
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white font-medium px-6 py-2.5 rounded-xl hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            Create Moderator
          </Button>
        </div>
      </div>
      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#ffff] cursor-pointer p-10 rounded-[1.4rem] shadow-md flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            {/* Left Section: Count & Title */}
            <div className="flex flex-col space-y-1">
              <h3 className="text-3xl font-bold text-gray-900">{item.count}</h3>
              <p className="text-gray-700 text-lg">{item.title}</p>
            </div>

            {/* Right Section: Icon */}
            <div
              className={`${item.color} text-white p-4 rounded-full text-2xl`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 mt-10 rounded-2xl shadow-sm">
        <div className="py-4">
          <h2 className="text-2xl font-semibold mb-4">
            Account Status Overview
          </h2>
        </div>

        {/* Users overview Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {custs.map((item, index) => (
            <div
              key={index}
              className="bg-[#ffff] cursor-pointer p-10 rounded-[1.4rem] shadow-md flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Left Section: Count & Title */}
              <div className="flex flex-col space-y-1">
                <h3 className="text-3xl font-bold text-gray-900">
                  {item.count}
                </h3>
                <p className="text-gray-700 text-lg">{item.title}</p>
              </div>

              {/* Right Section: Icon */}
              <div
                className={`${item.color} text-white p-4 rounded-full text-2xl`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>

        <Input.Search
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 py-2 rounded-xl"
        />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredUsers}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="rounded-xl"
          />
        )}
      </div>

      <Modal
        open={isModalOpen}
        centered
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <h2 className="text-xl font-semibold mb-4">Create Moderator</h2>

        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {/* First & Last Name Side by Side */}
          <div className="flex gap-4">
            <Form.Item
              name="first_name"
              label="First Name"
              className="w-1/2"
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input placeholder="John" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              className="w-1/2"
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
          <div className="flex gap-4">
            <Form.Item
              name="password"
              label="Password"
              className="w-1/2"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              className="w-1/2"
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
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
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
