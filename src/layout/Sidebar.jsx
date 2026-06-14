import {
  DashboardOutlined,
  LogoutOutlined,
  ProductOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined
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
  { key: "/settings", label: "Store Settings", icon: <SettingOutlined /> },
  { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
];

const MODULE_MENU_MAP = {
  product: {
    key: "/products",
    label: "Products",
    icon: <ProductOutlined />,
    children: [{ key: "/products/all", label: "All Products" }],
  },
  category: {
    key: "/categories",
    label: "Categories",
    icon: <ProductOutlined />,
  },
  stock: {
    key: "/stock",
    label: "Stock Management",
    icon: <ProductOutlined />,
  },
  order: {
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
  // cart: {
  //   key: "/cart",
  //   label: "Cart Management",
  //   icon: <ShoppingOutlined />,
  // },
};

const buildPermissionMenu = (hasPermission) => {
  const authorizedItems = Object.entries(MODULE_MENU_MAP)
    .filter(([module]) => hasPermission(module))
    .map(([, item]) => item);

  return [
    { key: "/", label: "Dashboard", icon: <DashboardOutlined /> },
    ...authorizedItems,
    { key: "logout", label: "Logout", icon: <LogoutOutlined /> },
  ];
};

export default function Sidebar({ collapsed, setCollapsed, criticalStock = 0, outOfStock = 0 }) {
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
        onCollapse={setCollapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={200}
        trigger={null}
        style={{
          position: "fixed",
          left: 0,
          top: 64,
          bottom: 0,
          // height: "auto",
          // overflowY: "auto",
          // zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "EC" : "E-Commerce"}
        </div>

        <Menu
          className="premium-sidebar-menu"
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={(keys) => {
            const latestOpenKey = keys.find((key) => !openKeys.includes(key));
            if (!rootSubmenuKeys.includes(latestOpenKey)) {
              setOpenKeys(keys);
            } else {
              setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            }
          }}
          onClick={handleMenuClick}
          style={{
            paddingBottom:
              !collapsed &&
                criticalStock > 0 &&
                outOfStock > 0
                ? 200
                : !collapsed &&
                  (criticalStock > 0 || outOfStock > 0)
                  ? 120
                  : 0,
          }}

        />
        {/* {(criticalStock > 0 || outOfStock > 0) && (
          <div
            onClick={() => navigate("/stock")}
            style={{
              position: "absolute",
              bottom: 16,
              left: 12,
              right: 12,
              cursor: "pointer",
              borderRadius: 8,
              padding: "10px 12px",
              background:
                outOfStock > 0 ? "#fff2f0" : "#fffbe6",
              border:
                outOfStock > 0
                  ? "1px solid #ffccc7"
                  : "1px solid #ffe58f",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color:
                  outOfStock > 0
                    ? "#cf1322"
                    : "#d48806",
              }}
            >
              {outOfStock > 0
                ? "Out of Stock Alert"
                : "Critical Stock Alert"}
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#595959",
                marginTop: 4,
              }}
            >
              {outOfStock > 0
                ? `${outOfStock} products are out of stock`
                : `${criticalStock} products need restocking`}
            </div>
          </div>
        )} */}
        {!collapsed && (criticalStock > 0 || outOfStock > 0) && (
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 12,
              right: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {outOfStock > 0 && (
              <div
                onClick={() => navigate("/stock")}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "#fff2f0",
                  border: "1px solid #ffccc7",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#cf1322",
                  }}
                >
                  Out of Stock Alert
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#595959",
                    marginTop: 4,
                  }}
                >
                  {outOfStock} products are out of stock
                </div>
              </div>
            )}

            {criticalStock > 0 && (
              <div
                onClick={() => navigate("/stock")}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "10px 12px",
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: "#d48806",
                  }}
                >
                  Critical Stock Alert
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#595959",
                    marginTop: 4,
                  }}
                >
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
