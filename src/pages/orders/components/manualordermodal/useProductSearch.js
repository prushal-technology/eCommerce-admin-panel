import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getAllProducts } from '../../../../api/products';

/**
 * Manages paginated product list with debounced search and infinite scroll.
 * Used by ManualOrderModal's product Select dropdowns.
 */
const useProductSearch = (enabled = false) => {
    const [productList, setProductList] = useState([]);
    const [productListLoading, setProductListLoading] = useState(false);
    const [productSearchText, setProductSearchText] = useState('');
    const [productsNextCursor, setProductsNextCursor] = useState(null);
    const [productsHasMore, setProductsHasMore] = useState(false);

    // Cache keeps selected products visible even after the list re-filters
    const [selectedProductsCache, setSelectedProductsCache] = useState({});

    const searchTimeoutRef = useRef(null);

    const loadProducts = async (search = '', append = false) => {
        setProductListLoading(true);
        try {
            const normalizedSearch = (search || '').trim();
            const after = append ? productsNextCursor : null;
            const res = await getAllProducts(10, after, normalizedSearch || null);

            if (res.success) {
                const transformed = (res.products || []).map((p) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price || 0,
                    discountPrice: p.discountPrice || 0,
                    bulkOrderPrice: p.bulkOrderPrice || 0,
                    stock: p.stock || {},
                    isActive: p.isActive,
                    images: p.images || [],
                    unit: p.unit,
                    measureValue: p.measureValue,
                }));

                setProductList((prev) => (append ? [...prev, ...transformed] : transformed));
                setProductsNextCursor(res.nextCursor);
                setProductsHasMore(res.hasMore);
            }
        } catch (err) {
            message.error('Failed to fetch products: ' + err.message);
        } finally {
            setProductListLoading(false);
        }
    };

    const handleProductSearch = (value) => {
        const text = value || '';
        setProductSearchText(text);
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => loadProducts(text, false), 400);
    };

    const handleProductPopupScroll = (event) => {
        const { scrollTop, offsetHeight, scrollHeight } = event.target;
        if (scrollTop + offsetHeight >= scrollHeight - 16 && productsHasMore && !productListLoading) {
            loadProducts(productSearchText, true);
        }
    };

    /** Call when a product is selected so it stays in the dropdown even after search changes. */
    const cacheProduct = (product) => {
        setSelectedProductsCache((prev) => ({
            ...prev,
            [product.id.toString()]: product,
        }));
    };

    /** Merged list: current page results + any previously-selected products. */
    const productOptions = (() => {
        const map = new Map();
        productList.forEach((p) => map.set(p.id.toString(), p));
        Object.values(selectedProductsCache).forEach((p) => map.set(p.id.toString(), p));
        return Array.from(map.values());
    })();

    const reset = () => {
        setProductSearchText('');
        setProductList([]);
        setProductsNextCursor(null);
        setProductsHasMore(false);
        setSelectedProductsCache({});
        clearTimeout(searchTimeoutRef.current);
    };

    // Initial load when the modal becomes visible
    useEffect(() => {
        if (enabled) loadProducts('', false);
        return () => clearTimeout(searchTimeoutRef.current);
    }, [enabled]);

    return {
        productOptions,
        productListLoading,
        handleProductSearch,
        handleProductPopupScroll,
        cacheProduct,
        reset,
    };
};

export default useProductSearch;