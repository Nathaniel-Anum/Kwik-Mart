import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Category from "./Pages/Category";
import Subcategory from "./Subcategory";
import SignIn from "./Pages/SignIn";
import Orders from "./Pages/Orders";

import ProtectedRoute from "./Pages/ProtectedRoute";
import Coupon from "./Pages/Coupon";
import Users from "./Pages/Users";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<SignIn />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="product" element={<Products />} />
          <Route path="category" element={<Category />} />
          <Route path="sub-category" element={<Subcategory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="coupon" element={<Coupon />} />
          <Route path="users" element={<Users />} />
         
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
