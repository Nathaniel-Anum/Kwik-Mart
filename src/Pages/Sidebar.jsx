import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaLayerGroup,
  FaList,
  FaSignOutAlt,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im"; // Import spinner icon

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    console.log("Logging out...");

    // Simulate a delay (e.g., API call)
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
    { name: "Users", icon: <FaUsers />, id: "Users", path: "/users" },
  ];

  return (
    <div className="w-64 h-screen fixed bg-black text-white flex flex-col">
      {/* Kirk Mart at the Top */}
      <div className="p-6 text-xl font-bold text-center ">Kwik Mart</div>

      {/* Navigation Links (Positioned Lower + More Spacing) */}
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
      </ul>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 rounded-lg cursor-pointer hover:bg-red-600 transition disabled:opacity-50"
          onClick={handleLogout}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <ImSpinner2 className="text-lg animate-spin" />{" "}
              {/* Loading Spinner */}
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
