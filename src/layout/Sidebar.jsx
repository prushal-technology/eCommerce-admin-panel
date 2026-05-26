// import {
//   DashboardOutlined,
//   LogoutOutlined,
//   ProductOutlined,
//   SettingOutlined,
//   ShoppingOutlined,
//   TeamOutlined,
//   UserOutlined
// } from "@ant-design/icons";
// import { Layout, Menu, Modal } from "antd";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Sidebar.css";
// const { Sider } = Layout;

// const menuItems = {
//   admin: [
//     {
//       key: "/",
//       label: "Dashboard",
//       icon: <DashboardOutlined />
//     },
//     {
//       key: "/products",
//       label: "Products",
//       icon: <ProductOutlined />,
//       children: [
//         { key: "/products/all", label: "All Products" },
//         { key: "/categories", label: "Categories" },
//         { key: "/stock", label: "Stock Management" },
//       ],
//     },
//     {
//       key: "/orders",
//       label: "Orders",
//       icon: <ShoppingOutlined />,
//       children: [
//         { key: "/orders/all", label: "All Orders" },
//         { key: "/orders/manual", label: "Manual Order Entry" },
//       ],
//     },
//     {
//       key: "/customers",
//       label: "Customers",
//       icon: <UserOutlined />,
//     },
//     {
//       key: "/employees",
//       label: "Employees",
//       icon: <TeamOutlined />,
//     },
//     {
//       key: "/delivery",
//       label: "Delivery Partners",
//       icon: <ShoppingOutlined />,
//     },
//     {
//       key: "/settings",
//       label: "Store Settings",
//       icon: <SettingOutlined />,
//     },
//     { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
//   ],

//   manager: [
//     {
//       key: "/",
//       label: "Dashboard",
//       icon: <DashboardOutlined />
//     },
//     {
//       key: "/products",
//       label: "Products",
//       icon: <ProductOutlined />,
//       children: [
//         { key: "/products/all", label: "All Products" },
//         { key: "/categories", label: "Categories" },
//         { key: "/stock", label: "Stock Management" },
//       ],
//     },
//     {
//       key: "/orders",
//       label: "Orders",
//       icon: <ShoppingOutlined />,
//       children: [
//         { key: "/orders/all", label: "All Orders" },
//         { key: "/orders/manual", label: "Manual Order Entry" },
//       ],
//     },
//     {
//       key: "/customers",
//       label: "Customers",
//       icon: <UserOutlined />,
//     },
//     {
//       key: "/delivery",
//       label: "Delivery Partners",
//       icon: <ShoppingOutlined />,
//     },
//     { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
//   ],

//   employee: [
//     {
//       key: "/",
//       label: "Dashboard",
//       icon: <DashboardOutlined />
//     },
//     {
//       key: "/products",
//       label: "Products",
//       icon: <ProductOutlined />,
//       children: [
//         { key: "/products/all", label: "All Products" },
//         { key: "/stock", label: "Stock Management" },
//       ],
//     },
//     {
//       key: "/orders",
//       label: "Orders",
//       icon: <ShoppingOutlined />,
//       children: [
//         { key: "/orders/all", label: "All Orders" },
//         { key: "/orders/manual", label: "Manual Order Entry" },
//       ],
//     },
//     {
//       key: "/customers",
//       label: "Customers",
//       icon: <UserOutlined />,
//     },
//     { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
//   ],
// };

// export default function Sidebar({ role, collapsed, setCollapsed }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [openKeys, setOpenKeys] = useState([]);

//   const items = menuItems[role] || menuItems.admin;
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (collapsed) {
//       setOpenKeys([]);
//     }
//   }, [collapsed]);

//   const handleMenuClick = ({ key }) => {
//     if (key === "logout") {
//       Modal.confirm({
//         title: "Logout",
//         content: "Are you sure you want to logout?",
//         okText: "Logout",
//         okButtonProps: { danger: true },
//         cancelText: "Cancel",
//         onOk: () => {
//           localStorage.clear();
//           navigate("/login", { replace: true });
//         },
//       });
//     } else {
//       navigate(key);

//       if (window.innerWidth < 768) {
//         setCollapsed(true);
//         setOpenKeys([]);
//       }
//     }
//   };
//   const rootSubmenuKeys = ["/products", "/orders"];

//   return (
//     <span>
//       {isMobile && !collapsed && (
//         <div
//           onClick={() => setCollapsed(true)}
//           style={{
//             position: "fixed",
//             top: 64,
//             left: 0,
//             width: "100%",
//             height: "calc(100vh - 64px)",
//             background: "rgba(0,0,0,0.3)",
//             zIndex: 1000,
//           }}
//         />
//       )}

//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={(value) => setCollapsed(value)}
//         collapsedWidth={isMobile ? 0 : 80}
//         width={200}
//         trigger={null}
//         style={{
//           position: "fixed",
//           left: 0,
//           top: 64,
//           bottom: 0,
//           height: "auto",
//           overflowY: "auto",
//           zIndex: 1000
//         }}
//       >
//         {/* Logo/Branding */}
//         <div style={{
//           height: 32,
//           margin: 16,
//           background: 'rgba(255, 255, 255, 0.1)',
//           borderRadius: 6,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: '#fff',
//           fontWeight: 'bold'
//         }}>
//           {collapsed ? 'EC' : 'E-Commerce'}
//         </div>

//         <Menu
//           className="premium-sidebar-menu"
//           mode="inline"
//           items={items}
//           selectedKeys={[location.pathname]}
//           openKeys={openKeys}
//           onOpenChange={(keys) => {
//             const latestOpenKey = keys.find(
//               (key) => openKeys.indexOf(key) === -1
//             );

//             if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
//               setOpenKeys(keys);
//             } else {
//               setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//             }
//           }}
//           onClick={handleMenuClick}
//         />
//       </Sider>
//     </span>
//   );
// }




import {
    DashboardOutlined,
    LogoutOutlined,
    ProductOutlined,
    ShoppingOutlined,
    TeamOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Layout, Menu, Modal } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
const { Sider } = Layout;

const menuItems = {
  admin: [
    {
      key: "/",
      label: "Dashboard",
      icon: <DashboardOutlined />
    },
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
        { key: "/orders/system", label: "System Orders" },
        { key: "/orders/bulk", label: "Bulk Orders" },
        { key: "/orders/custom", label: "Custom Orders" },
        { key: "/orders/user", label: "User Orders" },
      ],
    },
    {
      key: "/customers",
      label: "Customers",
      icon: <UserOutlined />,
    },
    {
      key: "/employees",
      label: "Employees",
      icon: <TeamOutlined />,
    },
    // {
    //   key: "/delivery",
    //   label: "Delivery Partners*",
    //   icon: <ShoppingOutlined />,
    // },
    // {
    //   key: "/settings",
    //   label: "Store Settings*",
    //   icon: <SettingOutlined />,
    // },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ],

  manager: [
    {
      key: "/",
      label: "Dashboard",
      icon: <DashboardOutlined />
    },
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
        { key: "/orders/system", label: "System Orders" },
        { key: "/orders/bulk", label: "Bulk Orders" },
        { key: "/orders/custom", label: "Custom Orders" },
        { key: "/orders/user", label: "User Orders" },
      ],
    },
    {
      key: "/customers",
      label: "Customers",
      icon: <UserOutlined />,
    },
    // {
    //   key: "/delivery",
    //   label: "Delivery Partners*",
    //   icon: <ShoppingOutlined />,
    // },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ],
  customer: [
    {
      key: "/products/all",
      label: "Products",
      icon: <ProductOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    }
  ],

  employee: [
    {
      key: "/",
      label: "Dashboard",
      icon: <DashboardOutlined />
    },
    {
      key: "/products",
      label: "Products",
      icon: <ProductOutlined />,
      children: [
        { key: "/products/all", label: "All Products" },
        { key: "/stock", label: "Stock Management" },
      ],
    },

    {
      key: "/orders",
      label: "Orders",
      icon: <ShoppingOutlined />,
      children: [
        { key: "/orders/system", label: "System Orders" },
        { key: "/orders/bulk", label: "Bulk Orders" },
        { key: "/orders/custom", label: "Custom Orders" },
        { key: "/orders/user", label: "User Orders" },
      ],
    },
    {
      key: "/customers",
      label: "Customers",
      icon: <UserOutlined />,
    },
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ],
};

export default function Sidebar({ role, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  const items = menuItems[role] || menuItems.admin;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
    }
  }, [collapsed]);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      Modal.confirm({
        title: "Logout",
        content: "Are you sure you want to logout?",
        okText: "Logout",
        okButtonProps: { danger: true },
        cancelText: "Cancel",
        onOk: () => {
          localStorage.clear();
          navigate("/login", { replace: true });
        },
      });
    } else {
      navigate(key);

      if (window.innerWidth < 768) {
        setCollapsed(true);
        setOpenKeys([]);
      }
    }
  };
  const rootSubmenuKeys = ["/products", "/orders"];

  return (
    <span>
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            width: "100%",
            height: "calc(100vh - 64px)",
            background: "rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
        />
      )}

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        collapsedWidth={isMobile ? 0 : 80}
        width={200}
        trigger={null}
        style={{
          position: "fixed",
          left: 0,
          top: 64,
          bottom: 0,
          height: "auto",
          overflowY: "auto",
          zIndex: 1000
        }}
      >
        {/* Logo/Branding */}
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'EC' : 'E-Commerce'}
        </div>

        <Menu
          className="premium-sidebar-menu"
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find(
              (key) => openKeys.indexOf(key) === -1
            );

            if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
              setOpenKeys(keys);
            } else {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            }
          }}
          onClick={handleMenuClick}
        />
      </Sider>
    </span>
  );
}

