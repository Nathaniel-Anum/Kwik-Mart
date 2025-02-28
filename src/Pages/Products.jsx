import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  message,
} from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchSubcategories = async () => {
  const { data } = await axios.get(
    "https://supermart-q7ed.onrender.com/api/subcategories/"
  );
  return data;
};

const fetchProducts = async () => {
  const { data: products } = await axios.get(
    "https://supermart-q7ed.onrender.com/api/products/"
  );
  const { data: subcategories } = await axios.get(
    "https://supermart-q7ed.onrender.com/api/subcategories/"
  );

  return products.map((product) => ({
    ...product,
    sub_category: subcategories.find((sub) => sub.id === product.sub_category),
  }));
};

const createProduct = async (formData) => {
  const { data } = await axios.post(
    "https://supermart-q7ed.onrender.com/api/products/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: fetchSubcategories,
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      form.resetFields();
      setFile(null);
      message.success("Product added successfully!");
    },
    onError: () => {
      message.error("Failed to add product. Try again!");
    },
  });

  const handleAddProduct = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("sub_category", values.sub_category);
    formData.append("is_available", values.is_available || false);

    if (file) {
      formData.append("product_image", file);
    } else {
      message.error("Please select an image file!");
      return;
    }

    addMutation.mutate(formData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFile(null);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Sub-Category",
      dataIndex: "sub_category",
      key: "sub_category",
      render: (sub) => sub?.name || "N/A",
    },
    {
      title: "Available",
      dataIndex: "is_available",
      key: "is_available",
      render: (val) => (val ? "Yes" : "No"),
    },
  ];

  return (
    <div className="p-4 ml-[15rem] min-h-screen">
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <Table dataSource={products} columns={columns} rowKey="id" />

      <Modal
        title="Add Product"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item name="stock" label="Stock" initialValue={0}>
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item
            name="sub_category"
            label="Sub-Category"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select>
              {subcategories?.map((sub) => (
                <Select.Option key={sub.id} value={sub.id}>
                  {sub.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="is_available"
            label="Available"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item label="Product Image" name="product_image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={(info) => {
                const file = info.fileList[0]?.originFileObj;
                if (file) setFile(file);
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addMutation.isLoading}
              className="w-full"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
