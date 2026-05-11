import { Button } from "antd";
import { useCart } from "../../hooks/useCart";

const AddToCartButton = ({ productId }) => {
    const { handleAdd, loading } = useCart();

    return (
        <Button
            type="primary"
            loading={loading}
            onClick={() => handleAdd(productId)}
        >
            Add to Cart
        </Button>
    );
};

export default AddToCartButton;