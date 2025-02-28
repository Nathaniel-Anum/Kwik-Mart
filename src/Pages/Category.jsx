import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Tooltip,
  Popover,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Fetch categories function
const fetchCategories = async () => {
  const { data } = await axios.get(
    "https://supermart-q7ed.onrender.com/api/categories/"
  );
  return data;
};

// Create category function using FormData
const createCategory = async (formData) => {
  const { data } = await axios.post(
    "https://supermart-q7ed.onrender.com/api/categories/",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

// Update category function
const updateCategory = async ({ id, formData }) => {
  const { data } = await axios.put(
    `https://supermart-q7ed.onrender.com/api/categories/${id}/`,
    formData
  );
  return data;
};

// Delete category function
const deleteCategory = async (id) => {
  await axios.delete(
    `https://supermart-q7ed.onrender.com/api/categories/${id}/`
  );
};

const Categories = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null); // Store uploaded file
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch categories with useQuery
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Mutation to create a new category
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      message.success("Category added successfully!");
      queryClient.invalidateQueries(["categories"]);
      setIsModalOpen(false);
      form.resetFields();
      setFile(null); // Reset file input
    },
    onError: () => {
      message.error("Failed to add category. Try again!");
    },
  });

  // Mutation to update a category
  const editMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      message.success("Category updated successfully!");
      queryClient.invalidateQueries(["categories"]);
      setIsEditModalOpen(false);
      editForm.resetFields();
      setFile(null);
    },
    onError: () => message.error("Failed to update category. Try again!"),
  });

  // Mutation to delete a category
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      message.success("Category deleted successfully!");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      message.error("Failed to delete category. Try again!");
    },
  });

  // Handle form submission with FormData
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (file) {
      formData.append("category_image", file);
    } else {
      console.error("No file selected!");
    }

    // Debugging: Log FormData entries
    console.log("Submitting FormData:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]); // Logs key-value pairs
    }

    createMutation.mutate(formData);
  };

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
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Form Submit
  const handleEditSubmit = async (values) => {
    if (!selectedCategory) return;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (file) {
      formData.append("category_image", file);
    }

    console.log("Submitting FormData for Edit:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    editMutation.mutate({ id: selectedCategory.id, formData });
  };

  // Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
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
    <div className="p-6 ml-[15rem]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold mb-4">Category</h1>
        <Button
          type="primary"
          className="bg-white text-black rounded-lg flex items-center px-4 py-2 hover:bg-gray-100 transition"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Category
        </Button>
      </div>

      {/* Ant Design Table */}
      <Table
        dataSource={categories || []}
        columns={columns}
        loading={isLoading}
        rowKey={(record) => record.id}
        className="bg-white rounded-lg"
      />

      {/* Modal for Adding Category */}
      <Modal
        title="Add New Category"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name!" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Category Image"
            name="category_image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload
              beforeUpload={() => false} // Prevent auto-upload
              maxCount={1} // Limit to 1 file
              onChange={(info) => {
                const file = info.fileList[0]?.originFileObj; // Get the first selected file
                if (file) {
                  setFile(file);
                  console.log("Selected File:", file);
                } else {
                  console.log("No file selected");
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition"
          >
            Submit
          </Button>
        </Form>
      </Modal>
      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name!" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>

          <Form.Item label="Category Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              onChange={(info) => {
                const file = info.fileList[0]?.originFileObj;
                setFile(file);
                console.log("Selected File:", file);
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

export default Categories;
