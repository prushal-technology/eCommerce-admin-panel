import { Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import ApplicationTag from "../components/Tag";
import HeaderBar from "./HeaderBar";
import Sidebar from "./Sidebar";

const { Content } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (user === true) return;
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const userRole = user.role || "employee";

  return (
    //<Layout style={{ minHeight: "100vh" }}>

    <Layout
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >


      <ApplicationTag />

      <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{
        marginTop: 2,
        marginLeft:
          window.innerWidth < 768
            ? 0
            : collapsed
              ? 80
              : 200,
        transition: "all .2s"
      }}>
        <Sidebar
          role={userRole}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* <Content
          style={{
            margin: window.innerWidth < 768 ? 8 : 16,
            padding: window.innerWidth < 768 ? 12 : 16,
          }}
        >
          <Outlet />
        </Content> */}

        <Content
          style={{
            margin: window.innerWidth < 768 ? 8 : 16,

            padding: window.innerWidth < 768 ? 12 : 16,

            height: "calc(100vh - 70px)",

            overflowY: "auto",
            overflowX: "hidden",

            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Content>


      </Layout>
    </Layout>
  );
}
