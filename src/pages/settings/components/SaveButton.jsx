import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SaveButton = ({
  loading,
  children,
}) => {
  return (
    <Button
      size="small"
      type="primary"
      htmlType="submit"
      loading={loading}
      icon={<SaveOutlined />}
    >
      {children}
    </Button>
  );
};

export default SaveButton;