import {
    Card,
    Form,
    Input,
    Select,
    Switch,
} from 'antd';

const { Option } = Select;

const GeneralTab = () => {
  return (
    <Card>

      <Form layout="vertical">

        <Form.Item label="Theme Mode">

          <Select defaultValue="light">
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
          </Select>

        </Form.Item>

        <Form.Item label="Primary Color">
          <Input type="color" />
        </Form.Item>

        <Form.Item label="Compact Mode">
          <Switch />
        </Form.Item>

      </Form>

    </Card>
  );
};

export default GeneralTab;