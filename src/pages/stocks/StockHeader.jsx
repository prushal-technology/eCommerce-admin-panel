import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';

const { Title } = Typography;

/**
 * Page header: title + "Manage Stock" and "Add New Product" action buttons.
 */
const StockHeader = ({ onManageStock, onAddProduct, canManageStock, canCreateProduct }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
        }}
    >
        <Title level={4} style={{ marginBottom: 0 }}>
            Stocks Management
        </Title>

        <Space>
            {canManageStock && (
                <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={onManageStock}
                >
                    Manage Stock
                </Button>
            )}

            {canCreateProduct && (
                <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={onAddProduct}
                >
                    Add New Product
                </Button>
            )}
        </Space>
    </div>
);

export default StockHeader;
