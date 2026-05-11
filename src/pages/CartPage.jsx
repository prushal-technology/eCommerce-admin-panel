import {
    Button,
    Card,
    Col,
    Divider,
    Empty,
    Row,
    Spin,
    Typography
} from "antd";
import { useEffect, useState } from "react";
import { getCart } from "../api/cartApi";
import CartList from "../components/cart/CartList";

const { Title, Text } = Typography;

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadCart = async () => {
        setLoading(true);
        try {
            const res = await getCart();
            if (res?.myCart) {
                setCart(res.myCart);
            } else {
                setCart(null);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            setCart(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCart();
    }, []);

    // ✅ Optimistic update (IMPORTANT)
    const handleLocalUpdate = (itemId, newQty) => {
        setCart((prev) => {
            if (!prev) return prev;

            const updatedItems = prev.items.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: newQty }
                    : item
            );

            return { ...prev, items: updatedItems };
        });
    };

    const total =
        cart?.items?.reduce(
            (sum, item) =>
                sum + item.quantity * Number(item.product.price),
            0
        ) || 0;



    return (
        <div>
            <Title level={3}>My Cart</Title>

            {loading ? (
                <div className="loader-container">
                    <Spin size="large" />
                </div>
            ) : cart?.items?.length > 0 ? (
                <Row gutter={16}>

                    {/* LEFT */}
                    <Col xs={24} md={16}>
                        <Card
                            title={`Cart Items (${cart.items.length})`}
                            variant="borderless"
                        >
                            <CartList
                                cartItems={cart.items}
                                reloadCart={loadCart}
                                onUpdateLocal={handleLocalUpdate}
                            />
                        </Card>
                    </Col>

                    {/* RIGHT */}
                    <Col xs={24} md={8}>
                        <Card title="Order Summary" variant="borderless">
                            <div className="summary-row">
                                <Text>Total Items</Text>
                                <Text>{cart.items.length}</Text>
                            </div>

                            <Divider />

                            <div className="summary-row">
                                <Text strong>Total Price</Text>
                                <Text strong>₹ {total.toFixed(2)}</Text>
                            </div>

                            <Divider />

                            <Button type="primary" size="large" block>
                                Proceed to Checkout
                            </Button>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <Card>
                    <Empty description="Your cart is empty" />
                </Card>
            )}
        </div>
    );
};

export default CartPage;