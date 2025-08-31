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
import Transaction from "./Pages/Transaction";
import AdminUser from "./Pages/AdminUser";
import Customer from "./Pages/Customer";
import ProtectedRoute from "./Pages/ProtectedRoute";

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
          <Route path="transactions" element={<Transaction />} />
          <Route path="adminuser" element={<AdminUser />} />
          <Route path="customer" element={<Customer />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
