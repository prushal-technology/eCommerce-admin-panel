import { Card, Empty, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { getWishlist } from "../api/wishListApi";
import WishlistList from "../components/Wishlist/wishlistList";

const { Title } = Typography;

const WishlistPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadWishlist = async () => {
        setLoading(true);

        try {
            const res = await getWishlist();

            console.log("WISHLIST →", res);

            setItems(res?.myWishlist || []);
        } catch {
            setItems([]);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    if (loading) return <Spin style={{ marginTop: 100 }} />;

    return (
        <div style={{ padding: 20 }}>
            <Title level={3}>My Wishlist ❤️</Title>

            <Card>
                {items.length > 0 ? (
                    <WishlistList items={items} reload={loadWishlist} />
                ) : (
                    <Empty description="Wishlist is empty" />
                )}
            </Card>
        </div>
    );
};

export default WishlistPage;