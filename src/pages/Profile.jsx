import {
  BankOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Avatar, Card, Col, Descriptions, Grid, Row, Tag } from "antd";
import dayjs from "dayjs";
import { getCurrentUser } from "../api/auth";

const { useBreakpoint } = Grid;

export default function Profile() {
  const u = getCurrentUser();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const show = (v) => (v ?? "") !== "" ? v : "N/A";
  const date = (d) => d ? dayjs(d).format("DD MMM YYYY") : "N/A";

  return (
    <Row justify="center" style={{ padding: isMobile ? 12 : 24 }}>
      <Col xs={24} md={20} lg={16}>
        <Card>

          {/* Header */}
          <Row
            align="middle"
            gutter={16}
            style={{ marginBottom: 24 }}
            wrap
          >
            <Col>
              <Avatar
                size={isMobile ? 70 : 100}
                src={u?.photo}
                icon={<UserOutlined />}
              />
            </Col>

            <Col flex="auto">
              <h2 style={{ marginBottom: 8 }}>
                {u?.name || u?.displayName || u?.email || "E-Commerce User"}
              </h2>

              <Tag color="blue">
                {u?.role === "admin" ? "Administrator" : 
                 u?.role === "manager" ? "Store Manager" : 
                 u?.role === "employee" ? "Sales Associate" : 
                 "E-Commerce Staff"}
              </Tag>
            </Col>
          </Row>

          {/* Details */}
          <Descriptions
            bordered
            column={isMobile ? 1 : 2}
            size={isMobile ? "small" : "middle"}
          >

            <Descriptions.Item label={<><UserOutlined /> User ID</>}>
              {show(u.id)}
            </Descriptions.Item>

            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {show(u.email)}
            </Descriptions.Item>

            <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
              {show(u.mobile)}
            </Descriptions.Item>

            <Descriptions.Item label={<><TeamOutlined /> Role</>}>
              <Tag color={u?.role === "admin" ? "red" : u?.role === "manager" ? "blue" : "green"}>
                {u?.role === "admin" ? "Administrator" : 
                 u?.role === "manager" ? "Store Manager" : 
                 u?.role === "employee" ? "Sales Associate" : 
                 "Staff"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label={<><CalendarOutlined /> Member Since</>}>
              {date(u.createdAt)}
            </Descriptions.Item>

            <Descriptions.Item label={<><ShoppingOutlined /> Department</>}>
              {u?.department || "E-Commerce Operations"}
            </Descriptions.Item>

            <Descriptions.Item label={<><DollarCircleOutlined /> Sales Target</>}>
              {show(u.salesTarget || "Not Assigned")}
            </Descriptions.Item>

            <Descriptions.Item label={<><SettingOutlined /> Permissions</>}>
              <div>
                {u?.permissions?.map(perm => (
                  <Tag key={perm} color="blue" style={{ marginBottom: 4 }}>
                    {perm}
                  </Tag>
                )) || <Tag color="default">Basic Access</Tag>}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label={<><CreditCardOutlined /> Payment Method</>}>
              {show(u.paymentMethod || "Bank Transfer")}
            </Descriptions.Item>

            <Descriptions.Item label={<><BankOutlined /> Bank Name</>}>
              {show(u.bankName)}
            </Descriptions.Item>

            <Descriptions.Item label="Account Number">
              {show(u.accountNumber)}
            </Descriptions.Item>

            <Descriptions.Item label="IFSC Code">
              {show(u.ifscCode)}
            </Descriptions.Item>

            <Descriptions.Item label={<><PhoneOutlined /> Emergency Contact</>}>
              {show(u.emergencyContact)}
            </Descriptions.Item>

            <Descriptions.Item
              label={<><HomeOutlined /> Address</>}
              span={isMobile ? 1 : 2}
            >
              {show(u.address)}
            </Descriptions.Item>

            <Descriptions.Item label="Work Location">
              {show(u.workLocation || "Remote")}
            </Descriptions.Item>

            <Descriptions.Item label={<><CalendarOutlined /> Last Login</>}>
              {date(u.lastLogin)}
            </Descriptions.Item>

          </Descriptions>

        </Card>
      </Col>
    </Row>
  );
}