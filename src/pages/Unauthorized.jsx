import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="Unauthorized"
      subTitle="You do not have permission to access this page."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Go to Dashboard
        </Button>
      }
    />
  );
};

export default Unauthorized;

