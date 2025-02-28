import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Table, Button, Modal, Input, Select, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const fetchCategories = async () => {
  const { data } = await axios.get(
    "https://supermart-q7ed.onrender.com/api/categories/"
  );
  return data;
};

const fetchSubcategories = async () => {
  const { data } = await axios.get(
    "https://supermart-q7ed.onrender.com/api/subcategories/"
  );
  return data;
};

const SubcategoriesPage = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: null,
  });
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch subcategories
  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: fetchSubcategories,
  });

  // Mutation to add subcategory
  const addSubcategory = useMutation({
    mutationFn: async (subcategory) =>
      axios.post(
        "https://supermart-q7ed.onrender.com/api/subcategories/",
        subcategory
      ),
    onSuccess: () => {
      message.success("Subcategory added!");
      queryClient.invalidateQueries(["subcategories"]);
      setIsAddModalOpen(false);
      setFormData({ name: "", description: "", category: null });
    },
    onError: () => message.error("Failed to add subcategory."),
  });

  // Mutation to edit subcategory
  const editSubcategory = useMutation({
    mutationFn: async (subcategory) => {
      return axios.put(
        `https://supermart-q7ed.onrender.com/api/subcategories/${editingSubcategory.id}/`,
        subcategory
      );
    },
    onSuccess: () => {
      message.success("Subcategory updated!");
      queryClient.invalidateQueries(["subcategories"]);
      setIsEditModalOpen(false);
      setEditingSubcategory(null);
    },
    onError: () => message.error("Failed to update subcategory."),
  });

  // Mutation to delete subcategory
  const deleteSubcategory = useMutation({
    mutationFn: async (id) =>
      axios.delete(
        `https://supermart-q7ed.onrender.com/api/subcategories/${id}`
      ),
    onSuccess: () => {
      message.success("Subcategory deleted!");
      queryClient.invalidateQueries(["subcategories"]);
    },
    onError: () => message.error("Failed to delete subcategory."),
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle category select
  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
  };

  // Handle adding a new subcategory
  const handleAddSubmit = () => {
    if (!formData.name || !formData.description || !formData.category) {
      return message.warning("All fields are required");
    }
    addSubcategory.mutate(formData);
  };

  // Handle editing a subcategory
  const handleEditSubmit = () => {
    if (!formData.name || !formData.description || !formData.category) {
      return message.warning("All fields are required");
    }
    editSubcategory.mutate({
      name: formData.name,
      description: formData.description,
      category: formData.category, // Send category ID
    });
  };

  // Open edit modal and set the selected record data
  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      category:
        categories?.find((cat) => cat.name === subcategory.category)?.id ||
        null, // Convert name to ID
    });
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    deleteSubcategory.mutate(id);
  };

  // Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => category || "N/A", // Display category name directly
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          <EditOutlined
            onClick={() => handleEdit(record)}
            className="text-blue-500 cursor-pointer"
          />
          <DeleteOutlined
            onClick={() => handleDelete(record.id)}
            className="text-red-500 cursor-pointer"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 ml-[15rem]">
       <h1 className="text-2xl font-semibold mb-4">Sub Category</h1>
      {/* Add Subcategory Button */}
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Subcategory
        </Button>
      </div>

      {/* Subcategories Table */}
      <Table
        dataSource={subcategories}
        columns={columns}
        rowKey="id"
        loading={subcategoriesLoading}
      />

      {/* Add Subcategory Modal */}
      <Modal
        title="Add Subcategory"
        open={isAddModalOpen}
        onOk={handleAddSubmit}
        onCancel={() => setIsAddModalOpen(false)}
        confirmLoading={addSubcategory.isLoading}
      >
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Enter Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Select
            placeholder="Select Category"
            loading={categoriesLoading}
            onChange={handleCategoryChange}
            style={{ width: "100%" }}
            value={formData.category}
          >
            {categories?.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>

      {/* Edit Subcategory Modal */}
      <Modal
        title="Edit Subcategory"
        open={isEditModalOpen}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalOpen(false)}
        confirmLoading={editSubcategory.isLoading}
      >
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Enter Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Select
            placeholder="Select Category"
            loading={categoriesLoading}
            onChange={handleCategoryChange}
            style={{ width: "100%" }}
            value={formData.category}
          >
            {categories?.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default SubcategoriesPage;
