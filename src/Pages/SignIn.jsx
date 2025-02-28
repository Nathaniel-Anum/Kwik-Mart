import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im"; // Import spinner icon

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); //for loading spinner

  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignIn = () => {
    setLoading(true);
    console.log("signing out...");

    // Simulate a delay (e.g., API call)
    setTimeout(() => {
      navigate("/");
    }, 2000); // 2-second delay before navigation
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-lg  w-96">
        <h2 className="text-2xl font-bold text-center text-gray-900 py-8 mb-6">
           Sign In
        </h2>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-gray-900 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-black rounded-md bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6 relative">
          <label className="block text-gray-900 font-semibold mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-2 border border-black rounded-md bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-700 cursor-pointer"
              onClick={handleTogglePassword}
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          className=" w-full bg-gray-900 flex items-center justify-center gap-3 text-white py-2 rounded-md font-semibold hover:bg-gray-700 transition cursor-pointer disabled:opacity-50"
          onClick={handleSignIn}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <>
              <ImSpinner2 className="text-lg animate-spin" />{" "}
              {/* Loading Spinner */}
              <span className="text-sm font-medium">Signing In...</span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">Sign In</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
