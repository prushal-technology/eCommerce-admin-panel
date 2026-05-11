import WishlistItem from "./WishlistItem";

const WishlistList = ({ items, reload }) => {
    return (
        <div>
            {items.map((item) => (
                <WishlistItem key={item.id} item={item} reload={reload} />
            ))}
        </div>
    );
};

export default WishlistList;