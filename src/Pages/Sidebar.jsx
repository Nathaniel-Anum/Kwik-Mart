import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaLayerGroup,
  FaList,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { RiCoupon2Line } from "react-icons/ri";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { name: "Category", icon: <FaLayerGroup />, path: "/category" },
  { name: "Sub Category", icon: <FaList />, path: "/sub-category" },
  { name: "Products", icon: <FaBox />, path: "/product" },
  { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
  { name: "Coupons", icon: <RiCoupon2Line />, path: "/coupon" },
  { name: "Users", icon: <FaUsers />, path: "/users" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setTimeout(() => navigate("/login"), 1500);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "240px",
          height: "100vh",
          background: "#111111",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
        className={`sidebar-fixed ${isOpen ? "sidebar-open" : ""}`}
      >
        {/* Top bar — brand name + mobile close */}
        <div
          style={{
            padding: "1.25rem 1rem 1.25rem 1.25rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
          }}
        >
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              letterSpacing: "1px",
              color: "#F5C100",
            }}
          >
            Kwik<span style={{ color: "#ffffff" }}>Mart</span>
          </span>

          {/* Close button — mobile only, hidden on desktop via className */}
          <button
            onClick={onClose}
            className="flex items-center justify-center lg:hidden"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.7)",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Section label */}
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            padding: "1.25rem 1.25rem 0.5rem",
            margin: 0,
          }}
        >
          Main Menu
        </p>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "0 0.75rem",
            overflowY: "auto",
          }}
        >
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.7rem 1rem",
                  borderRadius: "10px",
                  marginBottom: "0.2rem",
                  textDecoration: "none",
                  fontWeight: active ? 600 : 400,
                  fontSize: "0.88rem",
                  background: active ? "#F5C100" : "transparent",
                  color: active ? "#111111" : "rgba(255,255,255,0.72)",
                  transition: "all 0.18s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.72)";
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "60%",
                      background: "#111111",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: "0.75rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              padding: "0.72rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.88rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.18s ease",
              fontFamily: "'Poppins', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.72)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin" style={{ fontSize: "1rem" }} />
                <span>Logging out…</span>
              </>
            ) : (
              <>
                <FaSignOutAlt />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
