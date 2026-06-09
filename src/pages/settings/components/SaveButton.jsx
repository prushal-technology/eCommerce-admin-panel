import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SaveButton = ({
  loading,
  children,
}) => {
  return (
    <Button
    size="smalls"
      type="primary"
      htmlType="submit"
      loading={loading}
      icon={<SaveOutlined />}a
    >
      {children}
    </Button>
  );
};

export default SaveButton;