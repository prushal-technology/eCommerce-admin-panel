import { DeleteOutlined } from "@ant-design/icons";
import { Button, Typography, message } from "antd";
import { removeFromWishlist } from "../../api/wishListApi";

const { Text } = Typography;

const WishlistItem = ({ item, reload }) => {
    const handleRemove = async () => {
        try {
            await removeFromWishlist(item.product.id);
            message.success("Removed from wishlist");
            reload();
        } catch {
            message.error("Failed");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #eee",
            }}
        >
            <div>
                <Text strong>{item.product.name}</Text>
                <br />
                <Text type="secondary">₹ {item.product.price}</Text>
            </div>

            <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemove}
            />
        </div>
    );
};

export default WishlistItem;