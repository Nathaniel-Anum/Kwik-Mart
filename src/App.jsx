import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      {/* Wrap all pages with the Layout component */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="product" element={<Products />} />
        <Route path="category" element={<Category />} />
        <Route path="sub-category" element={<Subcategory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="transactions" element={<Transaction />} />
        <Route path="adminuser" element={<AdminUser />} />
        <Route path="customer" element={<Customer />} />
      </Route>
      <Route path="/login" element={<SignIn />} />
    </Routes>
  );
}

export default App;
