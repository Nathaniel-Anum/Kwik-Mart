import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaLayerGroup,
  FaList,
  FaSignOutAlt,
  FaChevronDown,
  FaShoppingCart, // Orders Icon
  FaMoneyBillWave, // Transactions Icon
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im"; // Spinner icon

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // Track submenu state

  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setTimeout(() => {
      navigate("/login");
    }, 2000); // 2-second delay before navigation
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, id: "Dashboard", path: "/" },
    {
      name: "Category",
      icon: <FaLayerGroup />,
      id: "Category",
      path: "/category",
    },
    {
      name: "Sub Category",
      icon: <FaList />,
      id: "Subcategory",
      path: "/sub-category",
    },
    { name: "Products", icon: <FaBox />, id: "Products", path: "/product" },
    { name: "Orders", icon: <FaShoppingCart />, id: "Orders", path: "/orders" }, // Added Orders
    {
      name: "Transactions",
      icon: <FaMoneyBillWave />,
      id: "Transactions",
      path: "/transactions",
    }, // Added Transactions
  ];

  return (
    <div className="w-64 h-screen fixed bg-black text-white flex flex-col">
      {/* Kwik Mart Title */}
      <div className="p-6 text-xl font-bold text-center">Kwik Mart</div>

      {/* Navigation Links */}
      <ul className="mt-12 space-y-4 px-4">
        {menuItems.map((item) => (
          <li key={item.id} onClick={() => setActive(item.id)}>
            <Link
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition duration-300 ${
                active === item.id ? "bg-blue-500" : "hover:bg-blue-500"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          </li>
        ))}

        {/* Users with Submenu */}
        <li>
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition duration-300 ${
              active === "Users" ? "bg-blue-500" : "hover:bg-blue-500"
            }`}
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setActive("Users");
            }}
          >
            <div className="flex items-center gap-4">
              <FaUsers className="text-lg" />
              <span className="font-medium">Users</span>
            </div>
            <FaChevronDown
              className={`transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Submenu */}
          {userMenuOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li onClick={() => setActive("AdminUsers")}>
                <Link
                  to="/adminuser"
                  className={`flex items-center gap-4 px-4 py-2 rounded-lg transition duration-300 ${
                    active === "AdminUsers"
                      ? "bg-blue-500"
                      : "hover:bg-blue-500"
                  }`}
                >
                  <span className="font-medium">Admin Users</span>
                </Link>
              </li>
              <li onClick={() => setActive("Customers")}>
                <Link
                  to="/customer"
                  className={`flex items-center gap-4 px-4 py-2 rounded-lg transition duration-300 ${
                    active === "Customers" ? "bg-blue-500" : "hover:bg-blue-500"
                  }`}
                >
                  <span className="font-medium">Customers</span>
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 rounded-lg cursor-pointer hover:bg-red-600 transition disabled:opacity-50"
          onClick={handleLogout}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <ImSpinner2 className="text-lg animate-spin" />{" "}
              <span className="text-sm font-medium">Logging out...</span>
            </>
          ) : (
            <>
              <FaSignOutAlt className="text-lg" />
              <span className="text-sm font-medium">Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
