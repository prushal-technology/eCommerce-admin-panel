import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Typography } from 'antd';
import { useState } from 'react';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import { useCustomers } from '../hooks/useCustomers';
import CustomerTable from './customers/CustomerTable';
import EditCustomerModal from './customers/EditCustomerModal';

const { Search } = Input;
const { Title } = Typography;

const Customers = () => {
  const {
    customers,
    loading,
    fetchingMore,
    nextCursor,
    hasMore,
    searchText,
    setSearchText,
    skeletonRows,
    loadCustomers,
    deleteCustomer,
    updateCustomer,
  } = useCustomers();

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateCustomer(editingCustomer.id, values);
      setIsEditModalOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      message.error('Error updating customer: ' + error.message);
    }
  };

  const handleAddSuccess = () => {
    loadCustomers(null, true);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Customers Management
      </Title>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <Search
          size="small"
          className="small-search"
          placeholder="Search customers by name or email..."
          allowClear
          style={{ width: 250 }}
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Customer
        </Button>
      </div>

      <Card
        style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, }}
        bodyStyle={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, padding: 0, }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
            padding: 16,
          }}
        >
          <CustomerTable
            customers={customers}
            loading={loading}
            fetchingMore={fetchingMore}
            hasMore={hasMore}
            nextCursor={nextCursor}
            skeletonRows={skeletonRows}
            onEdit={handleEdit}
            onDelete={deleteCustomer}
            onLoadMore={(cursor) =>
              loadCustomers(cursor, false)
            }
          />

          {fetchingMore && (
            <div
              style={{
                textAlign: "center",
                padding: 12,
              }}
            >
              Loading more customers...
            </div>
          )}


        </div>
      </Card>

      <EditCustomerModal
        open={isEditModalOpen}
        customer={editingCustomer}
        onCancel={() => {
          setIsEditModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleEditSubmit}
      />

      <AddCustomerModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default Customers;