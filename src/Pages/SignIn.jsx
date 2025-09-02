import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im"; // Import spinner icon
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import logo from "../../src/Pages/utils/logo.jpg";

const SignIn = () => {
  const { setUser } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); //for loading spinner
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();
  const baseURL = "https://kwirkmart.expertech.dev";

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await axios.post(`${baseURL}/api/auth/jwt/create/`, values);
      return res.data;
    },
    onSuccess: (data) => {
      // console.log("✅ Login Success:", data);

      // Save tokens
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      setUser(data.user);

      // Show redirect loader
      setRedirecting(true);

      // Navigate after 1.5s
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.response.data.detail);
      setEmail("");
      setPassword("");
      // toast.error("❌ Login Failed:", error.response?.data || error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = { email, password };
    mutation.mutate(values);
  };

  // 🔹 If redirecting, show loader page
  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <ImSpinner2 className="text-4xl animate-spin text-gray-700" />
          <p className="text-gray-700 font-medium">
            Login Successful. Redirecting to Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white/20  backdrop-blur-lg p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 ">Admin</h2>

        <div className="flex  justify-center ">
          <img src={logo} alt="KwikMart" className="h-[12rem]" />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-900 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-black rounded-md bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-900 font-semibold mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-black rounded-md bg-transparent text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-2 flex items-center text-gray-700 cursor-pointer"
            >
              {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full bg-gray-900 flex items-center justify-center gap-3 text-white py-2 rounded-md font-semibold hover:bg-gray-700 transition cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <ImSpinner2 className="text-lg animate-spin" />
              <span className="text-sm font-medium">Signing In...</span>
            </>
          ) : (
            <span className="text-sm font-medium">Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
