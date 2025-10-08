import Sidebar from "./Sidebar";
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Fixed Left) */}
      <Sidebar />

      {/* Main Content (Navbar + Page Content) */}
      <div className="flex flex-col flex-1">
        {/* Navbar at the top */}
        <Navbar />

        {/* Main content area */}
        <div className="p-6 bg-[#ebdfd8] ">
          <Outlet /> {/* This will render the active route content */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
