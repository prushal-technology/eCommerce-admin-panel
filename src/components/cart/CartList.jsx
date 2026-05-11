import CartItem from "./CartItem";

const CartList = ({ cartItems, reloadCart, onUpdateLocal }) => {
    return (
        <div>
            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    reloadCart={reloadCart}
                    onUpdateLocal={onUpdateLocal}
                />
            ))}
        </div>
    );
};

export default CartList;
