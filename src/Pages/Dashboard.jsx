import { FaBox, FaThLarge, FaLayerGroup, FaUsers } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  // Sample data for the Pie Chart (Product Sales)
  const productData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Home Appliances", value: 200 },
    { name: "Books", value: 150 },
  ];

  // Colors for Pie Chart segments
  const COLORS = ["#4F46E5", "#22C55E", "#FACC15", "#EF4444"];

  // Sample data for the Bar Chart (User Growth)
  const userData = [
    { name: "Jan", users: 10 },
    { name: "Feb", users: 40 },
    { name: "Mar", users: 20 },
    { name: "Apr", users: 60 },
    { name: "May", users: 50 },
    { name: "Jun", users: 70 },
  ];

  const stats = [
    { title: "Products", count: 120, icon: <FaBox />, color: "bg-black" },
    { title: "Categories", count: 8, icon: <FaThLarge />, color: "bg-black" },
    {
      title: "Subcategories",
      count: 25,
      icon: <FaLayerGroup />,
      color: "bg-black",
    },
    { title: "Users", count: 50, icon: <FaUsers />, color: "bg-black" },
  ];

  return (
    <div className="p-6 ml-[15rem]">
      <h2 className="text-2xl   mb-6">Overview</h2>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#f0e7df] cursor-pointer p-10 rounded-[1.4rem] shadow-md flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            {/* Left Section: Count & Title */}
            <div className="flex flex-col space-y-1">
              <h3 className="text-3xl font-bold text-gray-900">{item.count}</h3>
              <p className="text-gray-700 text-lg">
                {item.title}
              </p>
            </div>

            {/* Right Section: Icon */}
            <div
              className={`${item.color} text-white p-6 rounded-full text-2xl`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
      {/* Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-10">
        {/* Product Sales Pie Chart */}
        <div className="bg-[#f0e7df] p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
          <h3 className="text-xl  mb-4 text-gray-900">
            Product Sales
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#4F46E5"
                dataKey="value"
                label
              >
                {productData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Users Bar Chart */}
        <div className="bg-[#f0e7df] p-6 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
          <h3 className="text-xl  mb-4 text-gray-900">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userData}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
