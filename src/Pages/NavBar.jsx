import { FaUser, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PAGE_NAMES = {
  "/dashboard": "Dashboard",
  "/category": "Category",
  "/sub-category": "Sub Category",
  "/product": "Products",
  "/orders": "Orders",
  "/coupon": "Coupons",
  "/users": "Users",
};

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const pageName = PAGE_NAMES[location.pathname] || "Dashboard";

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 1.5rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
        {/* Hamburger - mobile only */}
        <button
          className="flex items-center lg:hidden"
          onClick={onMenuToggle}
          style={{
            background: "#f5f5f5",
            border: "1px solid #ececec",
            borderRadius: "8px",
            cursor: "pointer",
            padding: "0.45rem 0.6rem",
            color: "#111111",
            fontSize: "1rem",
          }}
        >
          <FaBars />
        </button>
        <div>
          <h1
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "#111111",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {pageName}
          </h1>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#9ca3af",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            KwikMart Admin
          </p>
        </div>
      </div>

      {/* Right: user pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          background: "#f9f9f9",
          border: "1px solid #ececec",
          borderRadius: "50px",
          padding: "0.4rem 1rem 0.4rem 0.5rem",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "#F5C100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#111111",
            fontSize: "0.85rem",
          }}
        >
          <FaUser />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#111111",
              lineHeight: 1.2,
            }}
          >
            {user?.full_name || "Admin"}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.68rem",
              color: "#9ca3af",
              lineHeight: 1.2,
            }}
          >
            Administrator
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
