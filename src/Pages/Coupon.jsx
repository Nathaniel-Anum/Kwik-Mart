import React, { useMemo, useState } from "react";

import { RiCoupon2Line } from "react-icons/ri";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  message,
  Typography,
  Dropdown,
  Tag,
  Menu,
  Table,
  Spin,
} from "antd";
import { MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { FaTicketAlt } from "react-icons/fa";
import api from "./utils/apiClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const { Option } = Select;

const { Title, Text } = Typography;

const fetchCoupons = async () => {
  const res = await api.get("https://kwirkmart.expertech.dev/api/v1/coupons/");
  return res.data;
};

const Coupon = () => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // returns YYYY-MM-DD
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const payload = {
        code: values.code,
        description: values.description,
        discount_type: values.discount_type,
        max_uses: values.max_uses || null,
        max_uses_per_user: values.max_uses_per_user || null,
        min_order_total: values.min_order_total || null,
        valid_from: values.valid_from ? formatDate(values.valid_from.$d) : null,
        valid_to: values.valid_to ? formatDate(values.valid_to.$d) : null,
        value: values.value,
      };

      await api.post(
        "https://kwirkmart.expertech.dev/api/v1/coupons/",
        payload
      ); //
      toast.success("Coupon created successfully!");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create coupon.");
    } finally {
      setLoading(false);
    }
  };
  const handleGenerate = async (values) => {
    try {
      setLoad(true);
      const payload = {
        count: values.count,

        discount_type: values.discount_type,
        max_uses: values.max_uses || 1,

        valid_from: values.valid_from ? formatDate(values.valid_from.$d) : null,
        valid_to: values.valid_to ? formatDate(values.valid_to.$d) : null,
        value: values.value,
      };

      await api.post(
        "https://kwirkmart.expertech.dev/api/v1/generate/coupons/",
        payload
      ); //
      toast.success("Coupon generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setIsOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create coupon.");
    } finally {
      setLoad(false);
    }
  };

  //useQuery for fetching coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  // Filter coupons based on search input
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, coupons]);

  // Menu for delete actions
  const menu = (record) => (
    <Menu
      items={[
        {
          key: "delete",
          label: <span className="text-red-500">Delete Coupon</span>,
          onClick: () => message.info(`Deleting coupon ${record.code}`),
        },
      ]}
    />
  );

  // Defining table columns
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => (
        <Tag color="green" className="px-3 py-1 rounded-lg font-semibold">
          {code}
        </Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "discount_type",
      key: "discount_type",
      render: (type) => (
        <span className="capitalize text-gray-700">
          {type === "percent" ? "Percentage" : "Fixed Amount"}
        </span>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value, record) => (
        <Text strong>
          {record.discount_type === "percent" ? `${value}%` : `₦${value}`}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active) =>
        active ? (
          <Tag color="green" className="rounded-lg px-3 py-1">
            Active
          </Tag>
        ) : (
          <Tag color="red" className="rounded-lg px-3 py-1">
            Inactive
          </Tag>
        ),
    },
    {
      title: "Valid From",
      dataIndex: "valid_from",
      key: "valid_from",
      render: (date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Valid To",
      dataIndex: "valid_to",
      key: "valid_to",
      render: (date) =>
        new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <MoreOutlined className="text-xl cursor-pointer hover:text-gray-700" />
        </Dropdown>
      ),
    },
  ];

  // const { data: sales } = useQuery({
  //   queryKey: ["sales"],
  //   queryFn: api.get(
  //     "https://kwirkmart.expertech.dev/api/v1/orders/sales/summary/"
  //   ),
  // });
  // console.log(sales);

  

  const stats = [
    {
      title: "Total Coupons",
      count: filteredCoupons.length,
      icon: <RiCoupon2Line />,
      color: "bg-black",
    },
    {
      title: "Active Coupons",
      count: filteredCoupons.length,
      icon: <RiCoupon2Line />,
      color: "bg-black",
    },
    {
      title: "Total Redemptions",
      count: 0,
      icon: <RiCoupon2Line />,
      color: "bg-black",
    },
    {
      title: "Fixed Discount Value",
      count: 0,
      icon: <RiCoupon2Line />,
      color: "bg-black",
    },
  ];
  return (
    <div className="p-4 ml-[15rem] min-h-screen ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Coupons</h2>
        <div className="space-x-3">
          <Button
            type="default"
            icon={<FaTicketAlt className="text-lg" />}
            onClick={() => setIsOpen(true)}
            className="!bg-white border border-gray-300 text-gray-800 font-medium rounded-xl px-6 py-2.5 shadow-sm hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            Generate Coupons
          </Button>

          {/* New Coupon Button */}
          <Button
            icon={<PlusOutlined className="text-lg" />}
            onClick={() => setOpen(true)}
            className="bg-black text-white font-medium px-6 py-2.5 rounded-xl hover:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            New Coupon
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
      {/* Modal for creating Coupon*/}
      <Modal
        title={
          <span className="text-xl font-semibold text-gray-800">
            Create Coupon
          </span>
        }
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        footer={null}
        width={750}
        centered
        className="rounded-2xl"
        bodyStyle={{
          backgroundColor: "#f9f9f9",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{
            discount_type: "percent",
          }}
          className="space-y-4"
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                name="code"
                label={
                  <span className="text-gray-700 font-medium">Coupon Code</span>
                }
                rules={[
                  { required: true, message: "Please enter coupon code" },
                ]}
              >
                <Input
                  placeholder="Enter coupon code"
                  className=" !rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="discount_type"
                label={
                  <span className="text-gray-700 font-medium">
                    Discount Type
                  </span>
                }
                rules={[{ required: true }]}
              >
                <Select
                  className="!rounded-xl"
                  dropdownStyle={{
                    borderRadius: 10,
                  }}
                >
                  <Option value="percent">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="value"
                label={
                  <span className="text-gray-700 font-medium">
                    Discount Value
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter discount value" },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter value"
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="min_order_total"
                label={
                  <span className="text-gray-700 font-medium">
                    Minimum Order Total
                  </span>
                }
              >
                <Input
                  type="number"
                  placeholder="Optional"
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="valid_from"
                label={
                  <span className="text-gray-700 font-medium">Valid From</span>
                }
              >
                <DatePicker className="!w-full rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="valid_to"
                label={
                  <span className="text-gray-700 font-medium">Valid To</span>
                }
              >
                <DatePicker className="w-full rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="max_uses"
                label={
                  <span className="text-gray-700 font-medium">Max Uses</span>
                }
              >
                <Input
                  type="number"
                  placeholder="Optional"
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="max_uses_per_user"
                label={
                  <span className="text-gray-700 font-medium">
                    Max Uses Per User
                  </span>
                }
              >
                <Input
                  type="number"
                  placeholder="Optional"
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="description"
                label={
                  <span className="text-gray-700 font-medium">Description</span>
                }
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter description..."
                  className="!rounded-xl border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button
              onClick={() => {
                form.resetFields();
                setOpen(false);
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 hover:shadow-md transition-all"
            >
              Create Coupon
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal for generating Coupon*/}

      <Modal
        title={
          <span className="text-xl font-semibold text-gray-800">
            Generate Coupon
          </span>
        }
        open={isOpen}
        onCancel={() => {
          form.resetFields();
          setIsOpen(false);
        }}
        footer={null}
        width={750}
        centered
        className="rounded-2xl"
        bodyStyle={{
          backgroundColor: "#f9f9f9",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerate}
          initialValues={{
            discount_type: "percent",
            max_uses: 1,
            count: 1,
          }}
          className="space-y-4"
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item
                name="count"
                label={
                  <span className="text-gray-700 font-medium">
                    Number of Coupons
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter coupon code" },
                ]}
              >
                <Input
                  type="number"
                  placeholder="1"
                  initialValues={1}
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="discount_type"
                label={
                  <span className="text-gray-700 font-medium">
                    Discount Type
                  </span>
                }
                rules={[{ required: true }]}
              >
                <Select
                  className="!rounded-xl"
                  dropdownStyle={{
                    borderRadius: 10,
                  }}
                >
                  <Option value="percent">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="value"
                label={
                  <span className="text-gray-700 font-medium">
                    Discount Value
                  </span>
                }
                rules={[
                  { required: true, message: "Please enter discount value" },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter value"
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="valid_from"
                label={
                  <span className="text-gray-700 font-medium">Valid From</span>
                }
              >
                <DatePicker className="!w-full rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="valid_to"
                label={
                  <span className="text-gray-700 font-medium">Valid To</span>
                }
              >
                <DatePicker className="w-full rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="max_uses"
                label={
                  <span className="text-gray-700 font-medium">Max Uses</span>
                }
              >
                <Input
                  type="number"
                  placeholder="1"
                  initialValues={1}
                  className="!rounded-xl py-2.5 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <Button
              onClick={() => {
                form.resetFields();
                setIsOpen(false);
              }}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:shadow-sm transition-all"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={load}
              className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 hover:shadow-md transition-all"
            >
              Generate
            </Button>
          </div>
        </Form>
      </Modal>
      <div className="bg-white mt-10 p-6 rounded-2xl shadow-sm">
        {/* Coupon Header and Table Session */}
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            All Coupons
          </Title>
          <div className="relative w-64">
            <Input
              prefix={<SearchOutlined className="text-gray-400 mr-2" />}
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl py-2 border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={filteredCoupons}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              className="rounded-lg text-base"
            />
            <div className="text-gray-500 text-sm mt-3">
              {filteredCoupons.length} coupon
              {filteredCoupons.length !== 1 ? "s" : ""} found
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Coupon;
