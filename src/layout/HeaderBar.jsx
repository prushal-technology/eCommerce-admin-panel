import { CloseOutlined, LogoutOutlined, MenuOutlined, UserOutlined, } from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDecryptedUser } from "../utils/crypto";

const { Header } = Layout;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default function HeaderBar({ collapsed, setCollapsed }) {
  const user = getDecryptedUser();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <UserOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        padding: "0 16px",
      }}
    >
      {/* LEFT SECTION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
          flex: 1,
        }}
      >
        {collapsed ? (
          <MenuOutlined
            onClick={() => setCollapsed(false)}
            style={{ fontSize: 20, cursor: "pointer" }}
          />
        ) : (
          <CloseOutlined
            onClick={() => setCollapsed(true)}
            style={{ fontSize: 20, cursor: "pointer" }}
          />
        )}

        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {user &&
            (isMobile
              ? `Flower's Admin - ${user.displayName || user.name || 'Admin'}`
              : `Flower's Admin - ${getGreeting()}, ${user.displayName || user.name || 'Admin'}`)}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        

        {/* User Profile Dropdown */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{
              backgroundColor: "#ffffff",
              color: "#727bd8",
              cursor: "pointer",
              flexShrink: 0,
            }}
          />
        </Dropdown>
      </div>
    </Header>
  );
}
