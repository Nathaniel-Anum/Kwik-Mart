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
  Tooltip,
  Popover,
  Image,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { LoadingOutlined } from "@ant-design/icons";

const fetchSubcategories = async () => {
  const { data } = await axios.get("http://168.231.114.1/api/subcategories/");
  return data;
};

const fetchProducts = async () => {
  const { data: products } = await axios.get(
    "http://168.231.114.1/api/products/"
  );
  const { data: subcategories } = await axios.get(
    "http://168.231.114.1/api/subcategories/"
  );

  return products.map((product) => ({
    ...product,
    sub_category: subcategories.find((sub) => sub.id === product.sub_category),
  }));
};

const createProduct = async (formData) => {
  const { data } = await axios.post(
    "http://168.231.114.1/api/products/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

// Update product function
const updateProduct = async ({ id, formData }) => {
  const { data } = await axios.put(
    `http://168.231.114.1/api/products/${id}/`,
    formData
  );
  return data;
};

// Delete category function
const deleteProduct = async (id) => {
  await axios.delete(`http://168.231.114.1/api/products/${id}/`);
};

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [file, setFile] = useState(null);
  const queryClient = useQueryClient();

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: fetchSubcategories,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      return axios.get("http://168.231.114.1/api/v1/list");
    },
  });

  //Mutation to add product
  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsModalOpen(false);
      form.resetFields();
      setFile(null);
      toast.success("Product added successfully!");
    },
    onError: () => {
      toast.error("Failed to add product. Try again!");
    },
  });

  // Mutation to update a product
  const editMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully!");
      queryClient.invalidateQueries(["products"]);
      setIsEditModalOpen(false);
      editForm.resetFields();
      setFile(null);
    },
    onError: () => toast.error("Failed to update category. Try again!"),
  });

  // Mutation to delete a category
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries(["products"]);
    },
    onError: () => {
      toast.error("Failed to delete product. Try again!");
    },
  });

  // Handle delete
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // Handle Edit Button Click
  const handleEditClick = (record) => {
    setSelectedCategory(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price,
      product_sku: record.product_sku,
      sub_category: record.sub_category?.id,
      stock: record.stock,
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Form Submit
  const handleEditSubmit = async (values) => {
    if (!selectedCategory) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("product_sku", values.product_sku);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("product_sku", values.product_sku);
    formData.append("sub_category", values.sub_category);
    if (file) {
      formData.append("product_image", file);
    }

    console.log("Submitting FormData for Edit:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    editMutation.mutate({ id: selectedCategory.id, formData });
  };

  const handleAddProduct = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("product_sku", values.product_sku);
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
    {
      title: "Image",
      dataIndex: "product_image",
      key: "product_image",
      render: (imgSrc) => (
        <Image
          width={60}
          src={imgSrc}
          alt="Product"
          placeholder
          fallback="https://via.placeholder.com/60"
        />
      ),
    },
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
    {
      title: "Product Sku",
      dataIndex: "product_sku",
      key: "product_sku",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt) =>
        new Date(createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (createdAt) =>
        new Date(createdAt).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popover
            content={
              <div className="flex gap-2">
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Yes
                </Button>
                <Button> No </Button>
              </div>
            }
            title="Are you sure?"
            trigger="click"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700"
              />
            </Tooltip>
          </Popover>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 ml-[15rem] min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        spinning={isLoading}
        tip="Loading..."
        size="large"
      >
        <Table dataSource={products || []} columns={columns} rowKey="id" />
      </Spin>

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
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            min={0}
            rules={[{ required: true, message: "Please enter product price" }]}
          >
            <Input type="number" min={0} className="w-full" />
          </Form.Item>

          <Form.Item name="stock" label="Stock" initialValue={0}>
            <Input className="w-full" />
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

          <Form.Item name="product_sku" label="Product Sku">
            <Input />
          </Form.Item>

          <Form.Item label="Product Image" name="product_image">
            <Upload
              className="w-full"
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
      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label=" Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Product Sku"
            name="product_sku"
            rules={[{ required: true, message: "Please enter product sku!" }]}
          >
            <Input placeholder="Enter product sku" />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" placeholder="Enter Price sku" />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please enter stock!" }]}
          >
            <Input type="number" placeholder="Enter stock" />
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

          <Form.Item label="Product Image" name="product_image">
            <Upload
              className="w-full"
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

          <Button type="primary" htmlType="submit" className="w-full">
            Save Changes
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
