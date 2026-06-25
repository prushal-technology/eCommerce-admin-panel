import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getAllStocks } from '../api/products';
import useProducts from './useProducts';

/**
 * Manages stock list data: fetching, pagination, search, and stats.
 * Separates all data concerns from the Stock UI.
 */
const useStockManager = () => {
    const { fetchProducts } = useProducts();

    // ── Stock list ──────────────────────────────────────────────────────────────
    const [stockItems, setStockItems] = useState([]);
    const [stocksLoading, setStocksLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [stockStats, setStockStats] = useState({
        total: 0,
        low: 0,
        critical: 0,
        outOfStock: 0,
    });


    // ── Product list (for the "Manage Stock" select dropdown) ───────────────────
    const [productList, setProductList] = useState([]);
    const [productListLoading, setProductListLoading] = useState(false);
    const [productSearchText, setProductSearchText] = useState('');
    const [productsNextCursor, setProductsNextCursor] = useState(null);
    const [productsHasMore, setProductsHasMore] = useState(false);

    const searchTimeoutRef = useRef(null);

    // ── Stock helpers ───────────────────────────────────────────────────────────
    const getStockQuantity = (product) =>
        (product?.storefrontStock || 0) +
        (product?.systemStock || 0);



    const getStockStatus = (product) => {
        const qty = getStockQuantity(product);
        if (qty === 0) return { status: 'out_of_stock', color: 'red', text: 'Out of Stock' };
        if (qty <= 5) return { status: 'critical', color: 'orange', text: 'Critical' };
        if (qty <= 15) return { status: 'low', color: 'gold', text: 'Low Stock' };
        return { status: 'normal', color: 'green', text: 'Normal' };
    };

    const getStockPercentage = (product) => {
        const stock = getStockQuantity(product);
        const maxStock = Math.max(100, stock * 1.2);
        return Math.min(100, Math.round((stock / maxStock) * 100));
    };

    const getStorefrontStock = (product) =>
        product?.storefrontStock || 0;

    const getSystemStock = (product) =>
        product?.systemStock || 0;

    const getReservedQuantity = (product) =>
        (product?.storefrontReserved || 0) +
        (product?.systemReserved || 0);

    const getAvailableQuantity = (product) =>
        getStockQuantity(product) -
        getReservedQuantity(product);



    // ── Fetch stocks ────────────────────────────────────────────────────────────
    const loadStocks = async (query = '', cursor = null, isNewSearch = false) => {
        try {
            isNewSearch ? setStocksLoading(true) : setFetchingMore(true);

            const res = await getAllStocks(query || null, 10, cursor);

            if (res.success) {
                const groupedProducts = {};

                (res.allStocks || []).forEach((stock) => {
                    const productId = stock.product?.id;

                    if (!groupedProducts[productId]) {
                        groupedProducts[productId] = {
                            id: productId,
                            name: stock.product?.name || 'Unknown Product',
                            price: stock.product?.price,
                            images: stock.product?.images || [],
                            unit: stock.product?.unit || '',

                            storefrontStock: 0,
                            storefrontReserved: 0,

                            systemStock: 0,
                            systemReserved: 0,
                        };
                    }

                    if (stock.inventoryType === 'storefront') {
                        groupedProducts[productId].storefrontStock =
                            Number(stock.quantity || 0);

                        groupedProducts[productId].storefrontReserved =
                            Number(stock.reservedQuantity || 0);
                    }

                    if (stock.inventoryType === 'system') {
                        groupedProducts[productId].systemStock =
                            Number(stock.quantity || 0);

                        groupedProducts[productId].systemReserved =
                            Number(stock.reservedQuantity || 0);
                    }
                });

                const mapped = Object.values(groupedProducts);

                if (isNewSearch) {
                    setStockItems(mapped);
                } else {
                    setStockItems((prev) => {
                        const existingIds = new Set(prev.map((item) => item.id));
                        return [...prev, ...mapped.filter((item) => !existingIds.has(item.id))];
                    });
                }

                setNextCursor(res.nextCursor);
                setHasMore(res.hasMore);
                setStockStats({
                    total: res.totalProducts ?? 0,
                    low: res.lowStock ?? 0,
                    critical: res.criticalStock ?? 0,
                    outOfStock: res.outOfStock ?? 0,
                });
            } else {
                message.error(res.message || 'Failed to load stock data');
            }
        } catch {
            message.error('An error occurred while fetching stock data.');
        } finally {
            setStocksLoading(false);
            setFetchingMore(false);
        }
    };

    // ── Fetch products for modal dropdown ───────────────────────────────────────
    const loadProducts = async (search = '', append = false) => {
        try {
            setProductListLoading(true);
            const after = append ? productsNextCursor : null;
            const res = await fetchProducts(10, after, search);

            if (res) {
                const transformed = (res.products || []).map((p) => ({
                    id: p.id,
                    name: p.name,
                    // quantity: p.stock?.quantity || 0,
                    storefrontStock:
                        p.storefrontStock || 0,

                    systemStock:
                        p.systemStock || 0,
                }));

                setProductList((prev) => (append ? [...prev, ...transformed] : transformed));
                setProductsNextCursor(res.nextCursor);
                setProductsHasMore(res.hasMore);
            }
        } catch (error) {
            //console.error(error);
        } finally {
            setProductListLoading(false);
        }
    };

    const handleProductSearch = (value) => {
        setProductSearchText(value);
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => loadProducts(value, false), 400);
    };

    const handleProductPopupScroll = (event) => {
        const { scrollTop, offsetHeight, scrollHeight } = event.target;
        if (scrollTop + offsetHeight >= scrollHeight - 20 && productsHasMore && !productListLoading) {
            loadProducts(productSearchText, true);
        }
    };

    // ── Derived / filtered list ─────────────────────────────────────────────────
    const filteredStocks = stockItems.filter((item) => {
        const qty = getStockQuantity(item);
        if (stockFilter === 'low') return qty <= 15 && qty > 5;
        if (stockFilter === 'critical') return qty <= 5 && qty > 0;
        if (stockFilter === 'out') return qty === 0;
        return true;
    });

    // ── Effects ─────────────────────────────────────────────────────────────────
    // Debounced search → reload stocks
    useEffect(() => {
        const timer = setTimeout(() => loadStocks(searchText, null, true), 300);
        return () => clearTimeout(timer);
    }, [searchText]);

    // Initial product list load
    useEffect(() => { loadProducts(); }, []);

    return {
        // Stock list
        stockItems,
        filteredStocks,
        stocksLoading,
        fetchingMore,
        nextCursor,
        hasMore,
        stockStats,
        searchText,
        setSearchText,
        stockFilter,
        setStockFilter,
        loadStocks,

        // Product dropdown
        productList,
        productListLoading,
        handleProductSearch,
        handleProductPopupScroll,

        // Helpers
        getStockQuantity,
        getStorefrontStock,
        getSystemStock,

        getStockStatus,
        getStockPercentage,

        getReservedQuantity,
        getAvailableQuantity,
    };
};

export default useStockManager;