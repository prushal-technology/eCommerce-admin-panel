// import { HeartOutlined } from "@ant-design/icons";
// import { Button, message } from "antd";
// import { addToWishlist } from "../../api/wishListApi";

// const AddToWishlistButton = ({ productId }) => {
//     const handleAdd = async () => {
//         try {
//             await addToWishlist(productId);
//             message.success("Added to wishlist ❤️");
//         } catch {
//             message.error("Failed");
//         }
//     };

//     return (
//         <Button
//             icon={<HeartOutlined />}
//             onClick={handleAdd}
//         />
//     );
// };

// export default AddToWishlistButton;



import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { addToWishlist } from "../../api/wishListApi";

const AddToWishlistButton = ({ productId, wishlistIds, setWishlistIds }) => {
    const navigate = useNavigate();

    const id = Number(productId);
    const isInWishlist = wishlistIds.includes(id);

    const handleClick = async () => {
        // ✅ Already in wishlist → go to wishlist
        if (isInWishlist) {
            navigate("/wishlist");
            return;
        }

        try {
            await addToWishlist(id);

            message.success("Added to wishlist ❤️");

            // ✅ update UI instantly
            setWishlistIds((prev) => [...prev, id]);

        } catch (err) {
            console.error(err);
            message.error("Failed to add to wishlist");
        }
    };

    return (
        <Button
            type="text"
            icon={
                isInWishlist ? (
                    <HeartFilled style={{ color: "red" }} />
                ) : (
                    <HeartOutlined />
                )
            }
            onClick={handleClick}
        />
    );
};

export default AddToWishlistButton;