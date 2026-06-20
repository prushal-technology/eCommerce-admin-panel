// import {
//   DashboardOutlined,
//   LogoutOutlined,
//   ProductOutlined,
//   SettingOutlined,
//   ShoppingOutlined,
//   TeamOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import { Layout, Menu, Modal } from "antd";
// import { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import "./Sidebar.css";

// const { Sider } = Layout;

// const ADMIN_MENU = [
//   { key: "/", label: "Dashboard", icon: <DashboardOutlined /> },
//   {
//     key: "/products",
//     label: "Products",
//     icon: <ProductOutlined />,
//     children: [
//       { key: "/products/all", label: "All Products" },
//       { key: "/categories", label: "Categories" },
//       { key: "/stock", label: "Stock Management" },
//     ],
//   },
//   {
//     key: "/orders",
//     label: "Orders",
//     icon: <ShoppingOutlined />,
//     children: [
//       { key: "/orders/dashboard", label: "Orders Dashboard" },
//       { key: "/orders/system", label: "System Orders" },
//       { key: "/orders/bulk", label: "Bulk Orders" },
//       { key: "/orders/custom", label: "Custom Orders" },
//       { key: "/orders/user", label: "User Orders" },
//       { key: "/orders/bulk-enquiries", label: "Bulk Order Enquiries" },
//     ],
//   },
//   { key: "/customers", label: "Customers", icon: <UserOutlined /> },
//   { key: "/employees", label: "Employees", icon: <TeamOutlined /> },
//   { key: "/settings", label: "Store Settings", icon: <SettingOutlined /> },
//   { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
// ];


// // hasPermission signature: (module, access = 'view', subModule = null)
// const buildPermissionMenu = (hasPermission) => {
//   const items = [];

//   items.push({ key: "/", label: "Dashboard", icon: <DashboardOutlined /> });

//   // Products group
//   if (hasPermission("product", "view")) {
//     items.push({
//       key: "/products", label: "Products", icon: <ProductOutlined />,
//       children: [{ key: "/products/all", label: "All Products" }],
//     });
//   }
//   const orderChildren = [];
//   if (hasPermission("order", "view", "order_dashboard"))
//     orderChildren.push({ key: "/orders/dashboard", label: "Orders Dashboard" });
//   if (hasPermission("order", "view", "system_order"))
//     orderChildren.push({ key: "/orders/system", label: "System Orders" });
//   if (hasPermission("order", "view", "bulk_order"))
//     orderChildren.push({ key: "/orders/bulk", label: "Bulk Orders" });
//   if (hasPermission("order", "view", "custom_order"))
//     orderChildren.push({ key: "/orders/custom", label: "Custom Orders" });
//   if (hasPermission("order", "view", "user_order"))
//     orderChildren.push({ key: "/orders/user", label: "User Orders" });
//   if (hasPermission("order", "view", "bulk_order_enquiry"))
//     orderChildren.push({ key: "/orders/bulk-enquiries", label: "Bulk Order Enquiries" });

//   if (orderChildren.length > 0) {
//     items.push({
//       key: "/orders", label: "Orders", icon: <ShoppingOutlined />,
//       children: orderChildren,
//     });
//   }
//   if (hasPermission("category", "view"))
//     items.push({ key: "/categories", label: "Categories", icon: <ProductOutlined /> });
//   if (hasPermission("stock", "view"))
//     items.push({ key: "/stock", label: "Stock Management", icon: <ProductOutlined /> });

//   // Orders group — only show if at least one sub-module is accessible


//   items.push({ key: "logout", label: "Logout", icon: <LogoutOutlined /> });
//   return items;
// };
// export default function Sidebar({
//   collapsed,
//   setCollapsed,
//   criticalStock = 0,
//   outOfStock = 0,
// }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isAdmin, hasPermission, logout } = useAuth();
//   const [openKeys, setOpenKeys] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const items = useMemo(
//     () => (isAdmin ? ADMIN_MENU : buildPermissionMenu(hasPermission)),
//     [hasPermission, isAdmin]
//   );

//   const rootSubmenuKeys = ["/products", "/orders"];

//   const handleMenuClick = ({ key }) => {
//     if (key === "logout") {
//       Modal.confirm({
//         title: "Logout",
//         content: "Are you sure you want to logout?",
//         okText: "Logout",
//         okButtonProps: { danger: true },
//         cancelText: "Cancel",
//         onOk: () => {
//           logout();
//           navigate("/login", { replace: true });
//         },
//       });
//       return;
//     }
//     navigate(key);
//     if (isMobile) {
//       setCollapsed(true);
//       setOpenKeys([]);
//     }
//   };

//   return (
//     <span>
//       {isMobile && !collapsed && (
//         <div
//           onClick={() => setCollapsed(true)}
//           style={{
//             position: "fixed", top: 64, left: 0,
//             width: "100%", height: "calc(100vh - 64px)",
//             background: "rgba(0,0,0,0.3)", zIndex: 1000,
//           }}
//         />
//       )}

//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         collapsedWidth={isMobile ? 0 : 80}
//         width={200}
//         trigger={null}
//         style={{
//           position: "fixed", left: 0, top: 64, bottom: 0,
//           display: "flex", flexDirection: "column",
//           overflow: "hidden", zIndex: 1000,
//         }}
//       >
//         {/* Brand strip */}
//         <div
//           style={{
//             height: 32, margin: 16,
//             background: "rgba(255,255,255,0.1)", borderRadius: 6,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             color: "#fff", fontWeight: "bold", flexShrink: 0,
//           }}
//         >
//           {collapsed ? "EC" : "E-Commerce"}
//         </div>

//         {/* Scrollable menu */}
//         <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
//           <Menu
//             className="premium-sidebar-menu"
//             mode="inline"
//             items={items}
//             selectedKeys={[location.pathname]}
//             openKeys={openKeys}
//             onOpenChange={(keys) => {
//               const latestOpenKey = keys.find((k) => !openKeys.includes(k));
//               setOpenKeys(
//                 rootSubmenuKeys.includes(latestOpenKey)
//                   ? latestOpenKey ? [latestOpenKey] : []
//                   : keys
//               );
//             }}
//             onClick={handleMenuClick}
//           />
//         </div>

//         {/* Stock alerts pinned to bottom */}
//         {!collapsed && (criticalStock > 0 || outOfStock > 0) && (
//           <div style={{ padding: "8px 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
//             {outOfStock > 0 && (
//               <div
//                 onClick={() => navigate("/stock")}
//                 style={{
//                   cursor: "pointer", borderRadius: 8, padding: "10px 12px",
//                   background: "#fff2f0", border: "1px solid #ffccc7",
//                 }}
//               >
//                 <div style={{ fontWeight: 600, color: "#cf1322" }}>Out of Stock Alert</div>
//                 <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
//                   {outOfStock} products are out of stock
//                 </div>
//               </div>
//             )}
//             {criticalStock > 0 && (
//               <div
//                 onClick={() => navigate("/stock")}
//                 style={{
//                   cursor: "pointer", borderRadius: 8, padding: "10px 12px",
//                   background: "#fffbe6", border: "1px solid #ffe58f",
//                 }}
//               >
//                 <div style={{ fontWeight: 600, color: "#d48806" }}>Critical Stock Alert</div>
//                 <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
//                   {criticalStock} products need restocking
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </Sider>
//     </span>
//   );
// }


import {
  DashboardOutlined,
  LogoutOutlined,
  MailOutlined,
  ProductOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Sidebar.css";

const { Sider } = Layout;

const ADMIN_MENU = [
  { key: "/", label: "Dashboard", icon: <DashboardOutlined /> },
  {
    key: "/products",
    label: "Products",
    icon: <ProductOutlined />,
    children: [
      { key: "/products/all", label: "All Products" },
      { key: "/categories", label: "Categories" },
      { key: "/stock", label: "Stock Management" },
    ],
  },
  {
    key: "/orders",
    label: "Orders",
    icon: <ShoppingOutlined />,
    children: [
      { key: "/orders/dashboard", label: "Orders Dashboard" },
      { key: "/orders/system", label: "System Orders" },
      { key: "/orders/bulk", label: "Bulk Orders" },
      { key: "/orders/custom", label: "Custom Orders" },
      { key: "/orders/user", label: "User Orders" },
      { key: "/orders/bulk-enquiries", label: "Bulk Order Enquiries" },
    ],
  },
  { key: "/customers", label: "Customers", icon: <UserOutlined /> },
  { key: "/employees", label: "Employees", icon: <TeamOutlined /> },
  { key: "/enquiries", label: "Enquiries", icon: <MailOutlined /> }, // ← new
  { key: "/settings", label: "Store Settings", icon: <SettingOutlined /> },
  { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
];

const buildPermissionMenu = (hasPermission) => {
  const items = [];

  items.push({ key: "/", label: "Dashboard", icon: <DashboardOutlined /> });

  if (hasPermission("product", "view")) {
    items.push({
      key: "/products", label: "Products", icon: <ProductOutlined />,
      children: [{ key: "/products/all", label: "All Products" }],
    });
  }

  if (hasPermission("category", "view"))
    items.push({ key: "/categories", label: "Categories", icon: <ProductOutlined /> });

  if (hasPermission("stock", "view"))
    items.push({ key: "/stock", label: "Stock Management", icon: <ProductOutlined /> });

  // Orders group
  const orderChildren = [];
  if (hasPermission("order", "view", "order_dashboard"))
    orderChildren.push({ key: "/orders/dashboard", label: "Orders Dashboard" });
  if (hasPermission("order", "view", "system_order"))
    orderChildren.push({ key: "/orders/system", label: "System Orders" });
  if (hasPermission("order", "view", "bulk_order"))
    orderChildren.push({ key: "/orders/bulk", label: "Bulk Orders" });
  if (hasPermission("order", "view", "custom_order"))
    orderChildren.push({ key: "/orders/custom", label: "Custom Orders" });
  if (hasPermission("order", "view", "user_order"))
    orderChildren.push({ key: "/orders/user", label: "User Orders" });
  if (hasPermission("order", "view", "bulk_order_enquiry"))
    orderChildren.push({ key: "/orders/bulk-enquiries", label: "Bulk Order Enquiries" });

  if (orderChildren.length > 0) {
    items.push({
      key: "/orders", label: "Orders", icon: <ShoppingOutlined />,
      children: orderChildren,
    });
  }

  // Enquiries is admin-only (no permission module), shown here for completeness
  // If you add a permission module for it later, wrap in hasPermission check
  items.push({ key: "/enquiries", label: "Enquiries", icon: <MailOutlined /> });

  items.push({ key: "logout", label: "Logout", icon: <LogoutOutlined /> });
  return items;
};

export default function Sidebar({
  collapsed,
  setCollapsed,
  criticalStock = 0,
  outOfStock = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, hasPermission, logout } = useAuth();
  const [openKeys, setOpenKeys] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = useMemo(
    () => (isAdmin ? ADMIN_MENU : buildPermissionMenu(hasPermission)),
    [hasPermission, isAdmin]
  );

  const rootSubmenuKeys = ["/products", "/orders"];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      Modal.confirm({
        title: "Logout",
        content: "Are you sure you want to logout?",
        okText: "Logout",
        okButtonProps: { danger: true },
        cancelText: "Cancel",
        onOk: () => {
          logout();
          navigate("/login", { replace: true });
        },
      });
      return;
    }
    navigate(key);
    if (isMobile) {
      setCollapsed(true);
      setOpenKeys([]);
    }
  };

  return (
    <span>
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed", top: 64, left: 0,
            width: "100%", height: "calc(100vh - 64px)",
            background: "rgba(0,0,0,0.3)", zIndex: 1000,
          }}
        />
      )}

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={200}
        trigger={null}
        style={{
          position: "fixed", left: 0, top: 64, bottom: 0,
          display: "flex", flexDirection: "column",
          overflow: "hidden", zIndex: 1000,
        }}
      >
        <div
          style={{
            height: 32, margin: 16,
            background: "rgba(255,255,255,0.1)", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "bold", flexShrink: 0,
          }}
        >
          {collapsed ? "EC" : "E-Commerce"}
        </div>

        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Menu
            className="premium-sidebar-menu"
            mode="inline"
            items={items}
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={(keys) => {
              const latestOpenKey = keys.find((k) => !openKeys.includes(k));
              setOpenKeys(
                rootSubmenuKeys.includes(latestOpenKey)
                  ? latestOpenKey ? [latestOpenKey] : []
                  : keys
              );
            }}
            onClick={handleMenuClick}
          />
        </div>

        {!collapsed && (criticalStock > 0 || outOfStock > 0) && (
          <div style={{ padding: "8px 12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {outOfStock > 0 && (
              <div
                onClick={() => navigate("/stock")}
                style={{
                  cursor: "pointer", borderRadius: 8, padding: "10px 12px",
                  background: "#fff2f0", border: "1px solid #ffccc7",
                }}
              >
                <div style={{ fontWeight: 600, color: "#cf1322" }}>Out of Stock Alert</div>
                <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                  {outOfStock} products are out of stock
                </div>
              </div>
            )}
            {criticalStock > 0 && (
              <div
                onClick={() => navigate("/stock")}
                style={{
                  cursor: "pointer", borderRadius: 8, padding: "10px 12px",
                  background: "#fffbe6", border: "1px solid #ffe58f",
                }}
              >
                <div style={{ fontWeight: 600, color: "#d48806" }}>Critical Stock Alert</div>
                <div style={{ fontSize: 12, color: "#595959", marginTop: 4 }}>
                  {criticalStock} products need restocking
                </div>
              </div>
            )}
          </div>
        )}
      </Sider>
    </span>
  );
}