import {
  CrownOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Input, Row, Spin, Table, Tag } from "antd";

import React, { useMemo, useState } from "react";
import { FaUser } from "react-icons/fa";
import api from "./utils/apiClient";
import Title from "antd/es/skeleton/Title";
import { Text } from "recharts";

const Users = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      count: users?.data?.totals?.by_role?.customer|| 0,
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
      count:
        users?.data?.totals?.by_role?.moderator|| 0,
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

  return (
    <div className="p-4 ml-[15rem] min-h-screen ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">All Users</h2>
        <div className="space-x-3">
          {/* New Coupon Button */}
          <Button
            icon={<PlusOutlined className="text-lg" />}
            onClick={() => setOpen(true)}
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
          <h2 className="text-2xl font-semibold mb-4">Account Status Overview</h2>
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
    </div>
  );
};

export default Users;
