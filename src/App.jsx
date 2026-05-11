import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import Analytics from "./pages/Analytics";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";

// Product pages
import AddProduct from "./pages/products/AddProduct";
import AllProducts from "./pages/products/AllProducts";
import ProductDetail from "./pages/products/ProductDetail";

// Order pages
import AllOrders from "./pages/orders/AllOrders";
import ManualOrder from "./pages/orders/ManualOrder";
import SystemOrders from "./pages/orders/SystemOrders";
import UserOrders from "./pages/orders/UserOrders";

// Other pages
import Delivery from "./pages/Delivery";
import Employees from "./pages/Employees";
import Stock from "./pages/Stock";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Product Routes */}
          <Route path="/products/all" element={<AllProducts />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Order Routes */}
          <Route path="/orders/all" element={<AllOrders />} />
          <Route path="/orders/system" element={<SystemOrders />} />
          <Route path="/orders/user" element={<UserOrders />} />
          <Route path="/orders/manual" element={<ManualOrder />} />

          {/* Other Routes */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/stock" element={<Stock />} />

          <Route path="/employees" element={<Employees />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route>
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
