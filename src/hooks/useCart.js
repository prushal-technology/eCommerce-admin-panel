import { message } from "antd";
import { useState } from "react";
import { addToCart, removeCartItem, updateCartItem } from "../api/cartApi";

export const useCart = () => {
    const [loading, setLoading] = useState(false);

    const handleAdd = async (productId) => {
        setLoading(true);
        const res = await addToCart(productId, 1);
        setLoading(false);

        if (res) message.success("Added to cart");
    };

    const handleUpdate = async (id, qty) => {
        const res = await updateCartItem(id, qty);
        if (res) message.success("Updated");
    };

    const handleRemove = async (id) => {
        const res = await removeCartItem(id);
        if (res) message.success("Removed");
    };

    return { handleAdd, handleUpdate, handleRemove, loading };
};