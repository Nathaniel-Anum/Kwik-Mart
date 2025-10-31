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
  Col,
  Row,
  DatePicker,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LoadingOutlined } from "@ant-design/icons";
import api from "./utils/apiClient";

const fetchSubcategories = async () => {
  const { data } = await api.get(
    "https://kwirkmart.expertech.dev/api/subcategories/"
  );
  return data;
};

const fetchProducts = async () => {
  const { data: products } = await api.get(
    "https://kwirkmart.expertech.dev/api/products/"
  );

  const { data: subcategories } = await api.get(
    "https://kwirkmart.expertech.dev/api/subcategories/"
  );

  return products?.data?.map((product) => ({
    ...product,
    sub_category: subcategories.find((sub) => sub.id === product.sub_category),
  }));
};

const createProduct = async (formData) => {
  const { data } = await api.post(
    "https://kwirkmart.expertech.dev/api/products/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

// Update product function
const updateProduct = async ({ id, formData }) => {
  const { data } = await api.put(
    `https://kwirkmart.expertech.dev/api/products/${id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// Delete category function
const deleteProduct = async (id) => {
  await api.delete(`https://kwirkmart.expertech.dev/api/products/${id}/`);
};

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
      return api.get("https://kwirkmart.expertech.dev/api/v1/list");
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
    onError: (err) =>
      toast.error(err?.response?.data?.product_image[0] || err.message),
  });

  // Mutation for file upload for bulk products upload
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.post(
        "https://kwirkmart.expertech.dev/api/products/bulk-upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Upload successful!");
      setIsOpen(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error("Upload failed. Please try again.");
      console.error(error);
    },
  });

  // Submit handler for bulk file upload
  const handleSubmit = (values) => {
    const formData = new FormData();
    formData.append("file", values.file[0].originFileObj);
    formData.append("images_zip", values.images_zip[0].originFileObj);
    formData.append("dry_run", values.dry_run ? "true" : "false");

    uploadMutation.mutate(formData);
  };

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
    // setFile(null);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("product_sku", values.product_sku);
    formData.append("price", values.price);
    formData.append("stock", values.stock);

    formData.append("sub_category", values.sub_category);
    if (file && file instanceof File) {
      console.log("Appending new file:", file.name);
      formData.append("product_image", file);
    } else {
      console.log("No new file to upload");
    }

    console.log("file var:", file);
    console.log("is File?", file instanceof File);

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
    formData.append("country_of_origin", values.country_of_origin);
    formData.append("season_label", values.season_label);
    formData.append("is_available", values.is_available || false);
    formData.append("is_seasonal", values.is_seasonal || false);
    formData.append("season_start", values.season_start.format("YYYY-MM-DD"));
    formData.append("season_end", values.season_end.format("YYYY-MM-DD"));
    formData.append(
      "is_discounted_feature",
      values.is_discounted_feature || false
    );

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
      <div className="flex justify-end gap-2 mb-4">
        <Button
          // type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Product
        </Button>
        {/* Upload Product */}
        <Button
          type="default"
          icon={<UploadOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Upload Products
        </Button>
      </div>

      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        spinning={isLoading}
        // tip="Loading..."
        size="large"
      >
        <Table dataSource={products || []} columns={columns} rowKey="id" />
      </Spin>

      {/*Modal for adding products */}
      <Modal
        title="Add Product"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please enter product name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[
                  { required: true, message: "Please enter product price" },
                ]}
              >
                <Input type="number" min={0} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="description" label="Description">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="stock" label="Stock" initialValue={0}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="sub_category"
                label="Sub-Category"
                rules={[
                  { required: true, message: "Please select a subcategory" },
                ]}
              >
                <Select>
                  {subcategories?.map((sub) => (
                    <Select.Option key={sub.id} value={sub.id}>
                      {sub.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="product_sku" label="Product Sku">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="country_of_origin" label="Country of Origin">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="season_label" label="Season Label">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="season_start" label="Season Start">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="season_end" label="Season End">
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="is_available"
                label="Available"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="is_seasonal"
                label="Seasonal"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="is_discounted_feature"
                label="Discounted"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
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
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addMutation.isLoading}
              className="w-full"
            >
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/*Modal for updating products */}
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

          <Form.Item label="Product Image">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                setFile(file); // store the real File
                return false; // prevent auto upload
              }}
              onRemove={() => setFile(null)}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            Save Changes
          </Button>
        </Form>
      </Modal>

      {/* Upload Modal */}
      <Modal
        title="Upload Products"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={uploadMutation.isLoading}
        okText="Upload"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
        >
          {/* CSV File */}
          <Form.Item
            name="file"
            label="CSV File"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload CSV file" }]}
          >
            <Upload
              beforeUpload={() => false}
              accept=".csv"
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Upload CSV</Button>
            </Upload>
          </Form.Item>

          {/* Images Zip */}
          <Form.Item
            name="images_zip"
            label="Images ZIP"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Please upload ZIP file" }]}
          >
            <Upload
              beforeUpload={() => false}
              accept=".zip"
              maxCount={1}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button icon={<UploadOutlined />}>Upload ZIP</Button>
            </Upload>
          </Form.Item>

          {/* Dry Run Toggle */}
          <Form.Item
            name="dry_run"
            label="Dry Run"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
