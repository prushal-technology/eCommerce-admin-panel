// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import PermissionRoute from "./components/PermissionRoute";
// import AppLayout from "./layout/AppLayout";
// //import Cart from "./pages/Cart";
// import Categories from "./pages/Categories";
// import Customers from "./pages/Customers";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import Profile from "./pages/Profile";
// import ResetPassword from "./pages/ResetPassword";
// import Settings from "./pages/Settings";
// import Unauthorized from "./pages/Unauthorized";

// // Product pages
// import AddProduct from "./pages/products/AddProduct";
// import AllProducts from "./pages/products/AllProducts";
// import ProductDetail from "./pages/products/ProductDetail";

// // Order pages
// //import AllOrders from "./pages/orders/AllOrders";
// //import ManualOrder from "./pages/orders/ManualOrder";
// import BulkOrders from "./pages/orders/BulkOrders";
// import BulkOrderEnquiries from "./pages/orders/BulkOrdersEnquiries";
// import CustomOrders from "./pages/orders/CustomOrders";
// import SystemOrders from "./pages/orders/SystemOrders";
// import UserOrders from "./pages/orders/UserOrders";
// import OrdersDashboard from "./pages/OrdersDashboard";

// // Other pages
// import Delivery from "./pages/Delivery";
// import Employees from "./pages/Employees";
// import Stock from "./pages/Stock";
// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<AppLayout />}>
//           <Route path="/" element={<Dashboard />} />

//           {/* Product Routes */}
//           <Route element={<PermissionRoute module="product" />}>
//             <Route path="products/all" element={<AllProducts />} />
//             <Route path="products/:id" element={<ProductDetail />} />
//           </Route>
//           <Route element={<PermissionRoute module="product" access="update" />}>
//             <Route path="products/add" element={<AddProduct />} />
//           </Route>

//           {/* Order Routes */}
//           {/* <Route path="orders/all" element={<AllOrders />} /> */}
//           <Route element={<PermissionRoute module="order" />}>
//             <Route path="orders/dashboard" element={<OrdersDashboard />} />
//             <Route path="orders/system" element={<SystemOrders />} />
//             <Route path="orders/bulk" element={<BulkOrders />} />
//             <Route path="orders/custom" element={<CustomOrders />} />
//             <Route path="orders/user" element={<UserOrders />} />
//             <Route path="orders/bulk-enquiries" element={<BulkOrderEnquiries />} />
//           </Route>
//           {/* <Route path="orders/manual" element={<ManualOrder />} /> */}

//           {/* Other Routes */}
//           <Route path="customers" element={<Customers />} />
//           <Route element={<PermissionRoute module="category" />}>
//             <Route path="categories" element={<Categories />} />
//           </Route>
//           <Route element={<PermissionRoute module="stock" />}>
//             <Route path="stock" element={<Stock />} />
//           </Route>
//           {/* <Route element={<PermissionRoute module="cart" />}>
//             <Route path="cart" element={<Cart />} />
//           </Route> */}

//           <Route path="employees" element={<Employees />} />
//           <Route path="delivery" element={<Delivery />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="profile" element={<Profile />} />
//         </Route>

//         <Route>
//           <Route path="*" element={<div>404 Not Found</div>} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Route, Routes } from "react-router-dom";

import PermissionRoute from "./components/PermissionRoute";
import AppLayout from "./layout/AppLayout";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Equiries"; // ← new
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";

// Product pages
import AddProduct from "./pages/products/AddProduct";
import AllProducts from "./pages/products/AllProducts";
import ProductDetail from "./pages/products/ProductDetail";

// Order pages
import BulkOrders from "./pages/orders/BulkOrders";
import BulkOrderEnquiries from "./pages/orders/BulkOrdersEnquiries";
import CustomOrders from "./pages/orders/CustomOrders";
import SystemOrders from "./pages/orders/SystemOrders";
import UserOrders from "./pages/orders/UserOrders";
import OrdersDashboard from "./pages/OrdersDashboard";

// Other pages
import Employees from "./pages/Employees";
import Stock from "./pages/Stock";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Product Routes */}
          <Route element={<PermissionRoute module="product" />}>
            <Route path="products/all" element={<AllProducts />} />
            <Route path="products/:id" element={<ProductDetail />} />
          </Route>
          <Route element={<PermissionRoute module="product" access="update" />}>
            <Route path="products/add" element={<AddProduct />} />
          </Route>

          {/* Order Routes */}
          <Route element={<PermissionRoute module="order" />}>
            <Route path="orders/dashboard" element={<OrdersDashboard />} />
            <Route path="orders/system" element={<SystemOrders />} />
            <Route path="orders/bulk" element={<BulkOrders />} />
            <Route path="orders/custom" element={<CustomOrders />} />
            <Route path="orders/user" element={<UserOrders />} />
            <Route path="orders/bulk-enquiries" element={<BulkOrderEnquiries />} />
          </Route>

          {/* Other Routes */}
          <Route path="customers" element={<Customers />} />
          <Route element={<PermissionRoute module="category" />}>
            <Route path="categories" element={<Categories />} />
          </Route>
          <Route element={<PermissionRoute module="stock" />}>
            <Route path="stock" element={<Stock />} />
          </Route>

          <Route path="employees" element={<Employees />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="enquiries" element={<Enquiries />} />  {/* ← new */}
        </Route>

        <Route>
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}