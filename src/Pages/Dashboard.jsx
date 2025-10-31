import {
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import api from "../Pages/utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
const Dashboard = () => {
  // ----- fetch orders (list) -----
  const { data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("https://kwirkmart.expertech.dev/api/v1/list/"),
  });
  // console.log(data?.data)
  const orders = data?.data || [];

  // Calculate statistics
  const totalOrders = orders.length;
  const successfulPayments = orders.filter(
    (order) => order.payment_status === "Paid"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  // Calculate total revenue (sum of total_amount for paid orders)
  const totalRevenue = orders
    .filter((order) => order.payment_status === "Paid")
    .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)
    .toFixed(2);

  // Prepare data for cards
  const stats = [
    {
      title: "Total Revenue",
      count: totalRevenue,
      color: "bg-purple-500",
      icon: <FaMoneyBillWave />,
      isCurrency: true,
    },
    {
      title: "Total Orders",
      count: totalOrders,
      color: "bg-blue-500",
      icon: <FaShoppingCart />,
      isCurrency: false,
    },
    {
      title: "Successful Payments",
      count: successfulPayments,
      color: "bg-green-500",
      icon: <FaCheckCircle />,
      isCurrency: false,
    },
    {
      title: "Pending Orders",
      count: pendingOrders,
      color: "bg-yellow-500",
      icon: <FaClock />,
      isCurrency: false,
    },
  ];

  // ====== Sales Over Time (Monthly) ======
  const monthlyData = {};

  orders.forEach((order) => {
    const month = dayjs(order.order_date).format("MMM YYYY");
    if (!monthlyData[month]) {
      monthlyData[month] = { month, revenue: 0, orders: 0 };
    }
    monthlyData[month].revenue += parseFloat(order.total_amount || 0);
    monthlyData[month].orders += 1;
  });

  const salesData = Object.values(monthlyData).sort(
    (a, b) => new Date(a.month) - new Date(b.month)
  );

  // ======  Order Status Distribution ======
  const approvedCount = orders.filter((o) => o.status === "Approved").length;
  const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;
  const pendingCount = orders.filter((o) => o.status === "Processing").length;

  const orderStatusData = [
    { name: "Approved", value: approvedCount },
    { name: "Pending", value: pendingCount },
    { name: "Cancelled", value: cancelledCount },
  ];

  // ===== PAYMENT METHODS PIE CHART =====
  const paymentMethodsCount = orders.reduce((acc, order) => {
    const method = order.payment_method || "Unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  const totalPayments = Object.values(paymentMethodsCount).reduce(
    (sum, count) => sum + count,
    0
  );

  const paymentData = Object.keys(paymentMethodsCount).map((method) => ({
    name: method,
    value: paymentMethodsCount[method],
    percentage: ((paymentMethodsCount[method] / totalPayments) * 100).toFixed(
      1
    ),
  }));

  const COLORS = ["#22c55e", "#2B7FFF", "#f59e0b"]; // green, blue, amber

  // =====  RECENT ORDERS (last 24 hours) =====
  const now = dayjs();
  const recentOrders = orders.filter((order) =>
    dayjs(order.order_date).isAfter(now.subtract(24, "hour"))
  );

  return (
    <div className="p-6 ml-60">
      <h2 className="text-2xl   mb-8">Dashboard</h2>
      <p></p>

      {/* Cards Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-[#ffff] p-10 rounded-[1.4rem] shadow-md flex items-center justify-between transform transition duration-300 hover:scale-105 hover:shadow-lg"
          >
            {/* Left Section: Count & Title */}
            <div className="flex flex-col space-y-1">
              <h3 className="text-3xl font-bold text-gray-900">
                {item.isCurrency ? (
                  <>
                    ₵
                    <CountUp
                      end={parseFloat(item.count)}
                      duration={2.5}
                      decimals={2}
                    />
                  </>
                ) : (
                  <CountUp end={item.count} duration={2.5} />
                )}
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
      {/* Cards Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* ===== Line Chart: Sales Over Time ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Sales Over Time (Monthly Revenue & Order Volume)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="Revenue (₵)"
                strokeWidth={2}
                dot={false}
              />
              <LineChart
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                name="Orders"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ===== Bar Chart: Order Status Distribution ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" barSize={150}>
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === "Approved" ? "#22c55e" : entry.name ===  "Pending" ? "#F0B100": "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* ====== PIE CHART: PAYMENT METHODS ====== */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Payment Methods
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {paymentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* ===== Legend with Percentages ===== */}
          <div className="mt-6 space-y-2">
            {paymentData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b py-1 text-gray-700"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  {item.name}
                </span>
                <span>
                  {item.value} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <Link to="/orders">
          {/* ====== RECENT ORDERS ====== */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Recent Orders
            </h2>
            <p className='pb-6'>Orders placed in the last 24 hours</p>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                No recent orders available
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    className="p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold text-gray-800">
                        {order.placed_by}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dayjs(order.order_date).format("DD MMM YYYY, hh:mm A")}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-gray-600">
                        Order Status: {order.status}
                      </p>
                      <p className="text-gray-600">
                        Payment: {order.payment_status}
                      </p>
                      <p className="font-semibold text-gray-800">
                        ₵{order.total_amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
