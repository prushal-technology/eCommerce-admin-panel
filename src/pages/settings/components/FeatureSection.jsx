import {
  EditOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Card,
  Collapse,
  Form,
  Input,
  message,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { getFeatures, updateFeature } from '../../../api/cms';
import SaveButton from './SaveButton';

const { TextArea } = Input;
const { Text } = Typography;

// ── Single editable feature card ──────────────────────────────────────────────
const FeatureItem = ({ feature, onSaved }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      iconType: feature.iconType,
    });
  }, [feature, form]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const res = await updateFeature(feature.id, values);
      if (res.success) {
        message.success('Feature saved');
        onSaved();
      } else {
        message.error(res.message || 'Failed to save');
      }
    } catch {
      message.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const headerLabel = (
    <Space size="small" align="center">
      <EditOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
      <Text style={{ maxWidth: 400, fontSize: 13 }} ellipsis={{ tooltip: feature.title }}>
        {feature.title || 'Untitled Feature'}
      </Text>
      {feature.icon && (
        <Text type="secondary" style={{ fontSize: 11 }}>
          {feature.iconType ? `${feature.iconType} · ` : ''}{feature.icon}
        </Text>
      )}
    </Space>
  );

  return (
    <Collapse
      size="small"
      style={{ marginBottom: 10, borderRadius: 8 }}
      items={[
        {
          key: feature.id,
          label: headerLabel,
          children: (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'Please enter the title' }]}
              >
                <Input placeholder="e.g. Fast Delivery" />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <TextArea rows={3} placeholder="Enter description" />
              </Form.Item>

              <Space size="large" wrap style={{ width: '100%' }}>
                <Form.Item label="Icon" name="icon" style={{ marginBottom: 0, minWidth: 160 }}>
                  <Input placeholder="e.g. truck" />
                </Form.Item>

                <Form.Item label="Icon Type" name="iconType" style={{ marginBottom: 0, minWidth: 160 }}>
                  <Input placeholder="e.g. lucide" />
                </Form.Item>
              </Space>

              <div style={{ marginTop: 16 }}>
                <SaveButton loading={saving}>Save Feature</SaveButton>
              </div>
            </Form>
          ),
        },
      ]}
    />
  );
};

// ── Skeleton placeholder ──────────────────────────────────────────────────────
const FeatureSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton.Input
        key={i}
        active
        size="default"
        style={{ width: '100%', height: 40, borderRadius: 8 }}
      />
    ))}
  </div>
);

// ── Main section ──────────────────────────────────────────────────────────────
const FeatureSection = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getFeatures();
      if (res.success) {
        setFeatures(res.features);
      } else {
        message.error(res.message || 'Failed to load features');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <span>Feature Section</span>
          {!loading && (
            <Badge count={features.length} style={{ backgroundColor: '#1890ff' }} showZero />
          )}
        </Space>
      }
      style={{ marginBottom: 20 }}
    >
      {loading ? (
        <FeatureSkeleton />
      ) : features.length === 0 ? (
        <Text type="secondary">No features found.</Text>
      ) : (
        features.map((feature) => (
          <FeatureItem key={feature.id} feature={feature} onSaved={loadData} />
        ))
      )}
    </Card>
  );
};

export default FeatureSection;