import {
    PhoneOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Card,
    Col,
    Divider,
    Modal,
    Row,
    Space,
    Tag
} from "antd";

const CustomerDetailsModal = ({
    open,
    customer,
    onClose,
}) => {
    if (!customer) return null;

    const fullName = customer?.user
        ? `${customer.user.firstName || ""} ${customer.user.lastName || ""}`.trim()
        : customer.fullName;

    return (
        <Modal
            title="Customer Details"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Space
                align="center"
                size={16}
                style={{
                    width: "100%",
                    marginBottom: 20,
                }}
            >
                <Avatar
                    size={64}
                    icon={<UserOutlined />}
                />

                <div>
                    <h2 style={{ marginBottom: 4 }}>
                        {fullName}
                    </h2>

                    <Tag color="blue">
                        {customer.customerId}
                    </Tag>

                    <Tag
                        color={
                            customer?.user?.isActive
                                ? "green"
                                : "red"
                        }
                    >
                        {customer?.user?.isActive
                            ? "Active"
                            : "Inactive"}
                    </Tag>
                </div>
            </Space>

            <Card size="small">
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card size="small">
                            <div style={{ color: "#999" }}>Customer ID</div>
                            <div>{customer.customerId}</div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card size="small">
                            <div style={{ color: "#999" }}>Email</div>
                            <div>{customer?.user?.email || "N/A"}</div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card size="small">
                            <div style={{ color: "#999" }}>Mobile</div>
                            <div>{customer?.user?.phone || "N/A"}</div>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card size="small">
                            <div style={{ color: "#999" }}>Status</div>
                            <Tag color={customer?.user?.isActive ? "green" : "red"}>
                                {customer?.user?.isActive ? "Active" : "Inactive"}
                            </Tag>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Divider titlePlacement="left">
                Addresses
            </Divider>

            {customer?.addresses?.length ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {customer.addresses.map((address) => (
                        <Card
                            key={address.id}
                            size="small"
                            style={{
                                borderRadius: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontWeight: 600,
                                            fontSize: 15,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {address.name}
                                    </div>

                                    <div
                                        style={{
                                            color: "#595959",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <PhoneOutlined /> {address.phone}
                                    </div>

                                    <div
                                        style={{
                                            lineHeight: 1.8,
                                            color: "#262626",
                                        }}
                                    >
                                        {[
                                            address.addressline,
                                            address.landmark,
                                            address.city,
                                            address.state,
                                            address.pincode,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </div>
                                </div>

                                {address.isDefault && (
                                    <Tag color="green">
                                        Default Address
                                    </Tag>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card size="small">
                    No addresses available
                </Card>
            )}
        </Modal>
    );
};

export default CustomerDetailsModal;