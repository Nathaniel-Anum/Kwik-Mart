import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Main content — offset by sidebar width on desktop */}
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        className="lg:ml-[240px]"
      >
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "1.5rem" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
