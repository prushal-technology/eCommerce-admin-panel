import React, { useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, Upload, message, Divider, Space } from 'antd';
import { SaveOutlined, UploadOutlined, UserOutlined, BellOutlined, SecurityScanOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async (values) => {
    setLoading(true);
    try {
      // Save settings logic here
      message.success('Settings saved successfully');
    } catch (error) {
      message.error('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const GeneralSettings = () => (
    <Form layout="vertical" onFinish={handleSave}>
      <Card title="Store Information" style={{ marginBottom: 16 }}>
        <Form.Item label="Store Name" name="storeName" initialValue="ECommerce Store">
          <Input />
        </Form.Item>
        <Form.Item label="Store Description" name="storeDescription" initialValue="Your trusted online store">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Contact Email" name="contactEmail" initialValue="support@ecommerce.com">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" initialValue="+1 234-567-8900">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address" initialValue="123 Main St, City, State 12345">
          <TextArea rows={2} />
        </Form.Item>
      </Card>

      <Card title="Currency & Language" style={{ marginBottom: 16 }}>
        <Form.Item label="Default Currency" name="currency" initialValue="USD">
          <Select>
            <Option value="USD">USD - US Dollar</Option>
            <Option value="EUR">EUR - Euro</Option>
            <Option value="GBP">GBP - British Pound</Option>
            <Option value="JPY">JPY - Japanese Yen</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Default Language" name="language" initialValue="en">
          <Select>
            <Option value="en">English</Option>
            <Option value="es">Spanish</Option>
            <Option value="fr">French</Option>
            <Option value="de">German</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Timezone" name="timezone" initialValue="UTC">
          <Select>
            <Option value="UTC">UTC</Option>
            <Option value="America/New_York">Eastern Time</Option>
            <Option value="America/Chicago">Central Time</Option>
            <Option value="America/Denver">Mountain Time</Option>
            <Option value="America/Los_Angeles">Pacific Time</Option>
          </Select>
        </Form.Item>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Save Settings
        </Button>
      </Form.Item>
    </Form>
  );

  const NotificationSettings = () => (
    <Form layout="vertical" onFinish={handleSave}>
      <Card title="Email Notifications" style={{ marginBottom: 16 }}>
        <Form.Item label="New Order Notifications" name="newOrderEmail" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Customer Registration" name="customerRegistrationEmail" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Low Stock Alerts" name="lowStockEmail" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Payment Failed" name="paymentFailedEmail" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Marketing Emails" name="marketingEmails" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
      </Card>

      <Card title="SMS Notifications" style={{ marginBottom: 16 }}>
        <Form.Item label="Enable SMS Notifications" name="enableSms" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item label="Order Status Updates" name="orderStatusSms" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item label="Marketing SMS" name="marketingSms" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Save Settings
        </Button>
      </Form.Item>
    </Form>
  );

  const SecuritySettings = () => (
    <Form layout="vertical" onFinish={handleSave}>
      <Card title="Security Configuration" style={{ marginBottom: 16 }}>
        <Form.Item label="Two-Factor Authentication" name="twoFactorAuth" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
        <Form.Item label="Session Timeout (minutes)" name="sessionTimeout" initialValue={30}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Password Minimum Length" name="passwordMinLength" initialValue={8}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Require Special Characters" name="requireSpecialChars" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Account Lockout Attempts" name="lockoutAttempts" initialValue={5}>
          <Input type="number" />
        </Form.Item>
      </Card>

      <Card title="API Security" style={{ marginBottom: 16 }}>
        <Form.Item label="API Rate Limiting" name="apiRateLimit" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="CORS Enabled" name="corsEnabled" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item label="Webhook Secret" name="webhookSecret">
          <Input.Password />
        </Form.Item>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Save Settings
        </Button>
      </Form.Item>
    </Form>
  );

  const AppearanceSettings = () => (
    <Form layout="vertical" onFinish={handleSave}>
      <Card title="Store Appearance" style={{ marginBottom: 16 }}>
        <Form.Item label="Store Logo" name="logo">
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            showUploadList={false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Logo</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="Favicon" name="favicon">
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            showUploadList={false}
          >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Favicon</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="Primary Color" name="primaryColor" initialValue="#1890ff">
          <Input type="color" />
        </Form.Item>
        <Form.Item label="Secondary Color" name="secondaryColor" initialValue="#52c41a">
          <Input type="color" />
        </Form.Item>
      </Card>

      <Card title="Theme Settings" style={{ marginBottom: 16 }}>
        <Form.Item label="Theme Mode" name="themeMode" initialValue="light">
          <Select>
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
            <Option value="auto">Auto</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Compact Mode" name="compactMode" valuePropName="checked" initialValue={false}>
          <Switch />
        </Form.Item>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          Save Settings
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      <h2>Settings</h2>
      
      <div style={{ marginBottom: 24 }}>
        <Space size="large">
          <Button
            type={activeTab === 'general' ? 'primary' : 'default'}
            icon={<UserOutlined />}
            onClick={() => setActiveTab('general')}
          >
            General
          </Button>
          <Button
            type={activeTab === 'notifications' ? 'primary' : 'default'}
            icon={<BellOutlined />}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </Button>
          <Button
            type={activeTab === 'security' ? 'primary' : 'default'}
            icon={<SecurityScanOutlined />}
            onClick={() => setActiveTab('security')}
          >
            Security
          </Button>
          <Button
            type={activeTab === 'appearance' ? 'primary' : 'default'}
            icon={<UploadOutlined />}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </Button>
        </Space>
      </div>

      {activeTab === 'general' && <GeneralSettings />}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'security' && <SecuritySettings />}
      {activeTab === 'appearance' && <AppearanceSettings />}
    </div>
  );
};

export default Settings;
