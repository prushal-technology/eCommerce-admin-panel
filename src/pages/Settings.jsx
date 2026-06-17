import {
  BgColorsOutlined,
  FileTextOutlined,
  HomeOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

import { Button, Space } from 'antd';
import { useState } from 'react';

import AboutTab from './settings/tabs/AboutTab';
import ContactTab from './settings/tabs/ContactTab';
import GeneralTab from './settings/tabs/GeneralTab';
import HomeTab from './settings/tabs/HomeTab';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto', paddingRight: 4, }}>

      <h1 style={{ marginBottom: 30 }}>
        Settings
      </h1>

      <div style={{ marginBottom: 30 }}>

        <Space size="small" wrap>

          <Button
            size="small"
            type={activeTab === 'general' ? 'primary' : 'default'}
            icon={<BgColorsOutlined />}
            onClick={() => setActiveTab('general')}
          >
            General
          </Button>

          <Button
            size="small"
            type={activeTab === 'home' ? 'primary' : 'default'}
            icon={<HomeOutlined />}
            onClick={() => setActiveTab('home')}
          >
            Home
          </Button>

          <Button
            size="small"
            type={activeTab === 'about' ? 'primary' : 'default'}
            icon={<FileTextOutlined />}
            onClick={() => setActiveTab('about')}
          >
            About
          </Button>

          <Button
            size="small"
            type={activeTab === 'contact' ? 'primary' : 'default'}
            icon={<PhoneOutlined />}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </Button>

        </Space>

      </div>

      {activeTab === 'general' && <GeneralTab />}
      {activeTab === 'home' && <HomeTab />}
      {activeTab === 'about' && <AboutTab />}
      {activeTab === 'contact' && <ContactTab />}

    </div>
  );
};

export default Settings;
