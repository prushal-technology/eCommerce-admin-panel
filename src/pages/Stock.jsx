import { Form, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import ProductModal from '../components/modals/ProductModal';
import usePermissions from '../hooks/usePermissions';
import useProducts from '../hooks/useProducts';
import useStockManager from '../hooks/useStockManager';
//import StockAlerts from './stocks/StockAlerts';
import StockHeader from './stocks/StockHeader';
import StockStats from './stocks/StockStats';
import StockTable from './stocks/StockTable';
import StockUpdateModal from './stocks/StockUpdateModal';

/**
 * Stock management page.
 *
 * Responsibilities kept here (orchestration only):
 *  - Wiring the stock manager hook to child components
 *  - Coordinating modal open/close state
 *  - Delegating stock-update and product-creation side-effects
 */
const Stock = () => {
  const { canUpdate } = usePermissions();
  const canManageStock = canUpdate('stock');
  const canCreateProduct = canUpdate('product');

  const {
    categories,
    actionLoading,
    fetchCategories,
    createProduct,
    addProductImage,
    updateProductStock,
  } = useProducts();

  const {
    // Table data
    filteredStocks,
    stocksLoading,
    fetchingMore,
    hasMore,
    nextCursor,
    stockStats,
    searchText,
    setSearchText,
    stockFilter,
    setStockFilter,
    loadStocks,

    // Product dropdown (inside modal)
    productList,
    productListLoading,
    handleProductSearch,
    handleProductPopupScroll,

    // Helpers
    getStockQuantity,
    getStockStatus,
    getStockPercentage,
  } = useStockManager();

  // ── Stock update modal ─────────────────────────────────────────────────────
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [stockForm] = Form.useForm();

  const handleOpenManageStock = () => {
    if (!canManageStock) return;

    stockForm.resetFields();
    setSelectedStockItem(null);
    setIsStockModalOpen(true);
  };

  const handleEditStock = (record, type) => {
    if (!canManageStock) return;

    const currentQty = getStockQuantity(record);
    setSelectedStockItem(record);
    stockForm.setFieldsValue({
      stock: type === 'set' ? currentQty : undefined,
      updateType: type,
      quantity: type === 'set' ? currentQty : 1,
    });
    setIsStockModalOpen(true);
  };

  const handleProductSelect = (value) => {
    const product = productList.find((p) => p.id === value);
    if (!product) return;
    setSelectedStockItem({
      id: product.id,
      name: product.name,
      stock: { quantity: Number(product.quantity || 0) },
    });
    stockForm.setFieldsValue({ updateType: 'add', quantity: 1 });
  };

  const handleStockFormFinish = async (values) => {
    if (!canManageStock) return;

    try {
      const currentQty = getStockQuantity(selectedStockItem);
      let newStock = currentQty;

      if (values.updateType === 'set') newStock = values.stock;
      if (values.updateType === 'add') newStock = currentQty + values.quantity;
      if (values.updateType === 'subtract') newStock = Math.max(0, currentQty - values.quantity);

      const res = await updateProductStock(selectedStockItem.id, newStock);

      if (res) {
        await loadStocks(searchText, null, true);
        setIsStockModalOpen(false);
        stockForm.resetFields();
      } else {
        message.error('Failed to update stock');
      }
    } catch {
      message.error('Failed to update stock');
    }
  };

  // ── Add product modal ──────────────────────────────────────────────────────
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    if (canCreateProduct) {
      fetchCategories();
    }
  }, [canCreateProduct, fetchCategories]);

  const handleAddProduct = () => {
    if (!canCreateProduct) return;

    productForm.resetFields();
    setImageList([]);
    setIsProductModalOpen(true);
  };

  const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    productForm.resetFields();
    setImageList([]);
  };

  const handleProductSubmit = async (values) => {
    if (!canCreateProduct) return;

    setProductLoading(true);
    try {
      const newProduct = await createProduct({
        ...values,
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
        measureValue: values.measureValue ? Number(values.measureValue) : undefined,
      });

      if (newProduct?.id) {
        for (const img of imageList.filter((i) => !i.id && i.originFileObj)) {
          await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(img.originFileObj);
            reader.onload = async () => {
              await addProductImage(newProduct.id, reader.result, 0);
              resolve();
            };
          });
        }
        message.success('Product added successfully!');
        handleProductModalClose();
      } else {
        message.error('Failed to add product');
      }
    } catch {
      message.error('An error occurred while adding product');
    } finally {
      setProductLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", }}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>

        <StockHeader
          onManageStock={handleOpenManageStock}
          onAddProduct={handleAddProduct}
          canManageStock={canManageStock}
          canCreateProduct={canCreateProduct}
        />

        {/* <StockAlerts
          critical={stockStats.critical}
          outOfStock={stockStats.outOfStock}
        /> */}

        <StockStats stats={stockStats} loading={stocksLoading} />

        <StockTable
          items={filteredStocks}
          loading={stocksLoading}
          fetchingMore={fetchingMore}
          hasMore={hasMore}
          searchText={searchText}
          stockFilter={stockFilter}
          onSearchChange={setSearchText}
          onFilterChange={setStockFilter}
          onEditStock={handleEditStock}
          canManageStock={canManageStock}
          onLoadMore={() => loadStocks(searchText, nextCursor, false)}
          getStockQuantity={getStockQuantity}
          getStockStatus={getStockStatus}
          getStockPercentage={getStockPercentage}
        />

        {canManageStock && (
          <StockUpdateModal
            open={isStockModalOpen}
            onCancel={() => setIsStockModalOpen(false)}
            onFinish={handleStockFormFinish}
            form={stockForm}
            actionLoading={actionLoading}
            selectedItem={selectedStockItem}
            onProductSelect={handleProductSelect}
            productList={productList}
            productListLoading={productListLoading}
            onProductSearch={handleProductSearch}
            onProductPopupScroll={handleProductPopupScroll}
          />
        )}

        {canCreateProduct && (
          <ProductModal
            visible={isProductModalOpen}
            onCancel={handleProductModalClose}
            onSubmit={handleProductSubmit}
            form={productForm}
            categories={categories}
            loading={productLoading}
            imageList={imageList}
            setImageList={setImageList}
            title="Add Product"
          />
        )}

      </Space>
    </div >
  );
};

export default Stock;
