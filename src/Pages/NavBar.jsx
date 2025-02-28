import { FaUser } from "react-icons/fa";
//ebdfd8

const Navbar = () => {
  return (
    <nav className="bg-[#ebdfd8]  ml-[16rem]  px-6 py-6 flex border-b border-white/25 justify-between items-center">
      {/* Left: Dashboard Overview */}
      <h1 className="text-[1.5rem] ">Admin Panel </h1>

      {/* Right: User Info (Icon + Name in a Rounded Div) */}
      <div className="flex items-center gap-2 bg-white text-gray-800 px-8 py-3 rounded-full shadow-md">
        <FaUser className="text-lg" />
        <span className="text-lg font-medium">Reiner</span>
      </div>
    </nav>
  );
};

export default Navbar;
