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
    (order) => order.status === "Approved"
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
      title: "Awaiting Approval",
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
  const unpaid = orders.filter((o) => o.payment_status === "Unpaid").length;

  // console.log(approvedCount, cancelledCount, pendingCount, unpaid);

  const orderStatusData = [
    { name: "Approved", value: approvedCount },
    { name: "Pending", value: pendingCount },
    { name: "Cancelled", value: cancelledCount },
    { name: "Unpaid", value: unpaid },
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
    <div>
      {/* Page header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#111111", margin: 0 }}>Overview</h2>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", margin: 0 }}>Welcome back — here's what's happening in your store.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: "1.5rem" }}>
        {stats.map((item, index) => (
          <div
            key={index}
            className="km-stat-card"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#9ca3af", fontWeight: 500 }}>
                {item.title}
              </p>
              <h3 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 800, color: "#111111" }}>
                {item.isCurrency ? (
                  <>₵<CountUp end={parseFloat(item.count)} duration={2.5} decimals={2} /></>
                ) : (
                  <CountUp end={item.count} duration={2.5} />
                )}
              </h3>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#111111",
                color: "#F5C100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ marginBottom: "1.5rem" }}>
        {/* Line Chart */}
        <div className="km-page-card">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111", marginBottom: "1rem" }}>
            Sales Over Time
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

        {/* Bar Chart */}
        <div className="km-page-card">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111", marginBottom: "1rem" }}>
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

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie Chart */}
        <div className="km-page-card">
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111", marginBottom: "1rem" }}>
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
          {/* Recent Orders */}
          <div className="km-page-card" style={{ cursor: "pointer", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111111", margin: 0 }}>Recent Orders</h2>
              <span style={{ fontSize: "0.75rem", color: "#F5C100", fontWeight: 600 }}>View all →</span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginBottom: "1rem" }}>Orders placed in the last 24 hours</p>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>
                No orders in the last 24 hours
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {recentOrders.map((order) => (
                  <div
                    key={order.order_id}
                    style={{
                      padding: "0.9rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #f0f0f0",
                      background: "#fafafa",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.88rem", color: "#111111" }}>
                        {order.placed_by}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>
                        {dayjs(order.order_date).format("DD MMM, hh:mm A")}
                      </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#6b7280" }}>
                        {order.status}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#111111" }}>
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
