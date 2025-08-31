// ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access"); // 👈 check if token exists
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
