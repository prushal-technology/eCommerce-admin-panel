import {
  DollarCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  SafetyOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { message as antdMessage, Button, Card, Form, Input, notification, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../api/auth";
import "./login.css";

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = antdMessage.useMessage();

  useEffect(() => {
    const msg = localStorage.getItem("auth_message");
    if (msg) {
      notification.warning({
        message: "Authentication Required",
        description: msg,
        placement: "topRight",
      });
      localStorage.removeItem("auth_message");
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await loginAPI(values.email, values.password);
      
      if (result.success) {
        messageApi.success("Login successful!");
        navigate("/", { replace: true });
      } else {
        messageApi.error(result.message || "Login failed! Please check your credentials.");
      }
    } catch (error) {
      const errMsg = error.message || "Login failed! Please check your credentials.";
      messageApi.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {contextHolder}

      {/* LEFT SECTION */}
      <div className="login-left-panel">
        <div className="overlay" />

        <div className="left-content">
          <div className="brand-section">
            <div className="logo-circle">
              <ShoppingOutlined />
            </div>
            <Title level={1} className="main-heading">
              E-Commerce Admin
            </Title>
            <Text className="sub-heading">
              Manage your online store, products, orders & customers efficiently.
            </Text>
          </div>

          <div className="feature-boxes">
            <div className="feature-card">
              <ShoppingOutlined /> Product Management
            </div>
            <div className="feature-card">
              <DollarCircleOutlined /> Sales Analytics
            </div>
            <div className="feature-card">
              <SafetyOutlined /> Secure & Role-based Access
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="login-right-panel">
        <Card className="login-card-modern">
          <div className="login-header">
            <Title level={2}>Welcome Back</Title>
            <Text className="login-subtitle">
              Sign in to access your e-commerce dashboard
            </Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} className="login-form">
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, message: "Please enter your email address." }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="you@example.com"
                className="form-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password." }]}
            >
              <Input
                size="large"
                prefix={<LockOutlined />}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                suffix={
                  showPassword ? (
                    <EyeInvisibleOutlined
                      onClick={() => setShowPassword(false)}
                      className="password-toggle"
                    />
                  ) : (
                    <EyeOutlined
                      onClick={() => setShowPassword(true)}
                      className="password-toggle"
                    />
                  )
                }
                className="form-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="signin-btn"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}