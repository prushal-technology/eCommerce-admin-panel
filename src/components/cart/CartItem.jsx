import {
    DeleteOutlined,
    MinusOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Popconfirm,
    Row,
    Typography,
} from "antd";
import { useState } from "react";
import {
    removeCartItem,
    updateCartItem,
} from "../../api/cartApi";

const { Text } = Typography;

const CartItem = ({ item, reloadCart, onUpdateLocal }) => {
    const [qty, setQty] = useState(item.quantity);
    const [loading, setLoading] = useState(false);

    const updateQuantity = async (newQty) => {
        if (newQty < 1) return;

        setQty(newQty);

        // ✅ instant UI update
        onUpdateLocal(item.id, newQty);

        try {
            await updateCartItem(Number(item.id), newQty);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemove = async () => {
        setLoading(true);
        try {
            await removeCartItem(Number(item.id));
            reloadCart();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Card style={{ marginBottom: 12 }}>
            <Row align="middle" justify="space-between">

                {/* Product */}
                <Col span={8}>
                    <Text strong>{item.product.name}</Text>
                    <br />
                    <Text type="secondary">₹ {item.product.price}</Text>
                </Col>

                {/* Quantity */}
                <Col span={8}>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Button
                            icon={<MinusOutlined />}
                            onClick={() => updateQuantity(qty - 1)}
                            disabled={qty <= 1}
                        />

                        <Text strong>{qty}</Text>

                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => updateQuantity(qty + 1)}
                        />
                    </div>
                </Col>

                {/* Subtotal */}
                <Col span={4}>
                    <Text strong>
                        ₹ {(qty * Number(item.product.price)).toFixed(2)}
                    </Text>
                </Col>

                {/* Delete */}
                <Col span={4}>
                    <Popconfirm
                        title="Remove item"
                        description="Are you sure you want to remove this item?"
                        onConfirm={handleRemove}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            loading={loading}
                        />
                    </Popconfirm>
                </Col>

            </Row>
        </Card>
    );
};

export default CartItem;