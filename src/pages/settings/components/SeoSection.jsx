
// components/SeoSection.jsx

import {
    Card,
    Form,
    Input,
    message,
} from 'antd';

import { useEffect, useState } from 'react';

import {
    getSeoSections,
    updateSeoSection,
} from '../../../api/cms';

import SaveButton from './SaveButton';

const { TextArea } = Input;

const SeoSection = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const res = await getSeoSections();

    if (res.success && res.seos) {
      form.setFieldsValue(res.seos);
    }
  };

  const handleSubmit = async (values) => {

    setLoading(true);

    try {

      const res = await updateSeoSection(values);

      if (res.success) {
        message.success('SEO updated');
      } else {
        message.error(res.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="SEO Section"
      style={{ marginBottom: 20 }}
      loading={loading}
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >

        <Form.Item
          label="Title"
          name="title"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea rows={4} />
        </Form.Item>

        <SaveButton loading={loading}>
          Save SEO
        </SaveButton>

      </Form>

    </Card>
  );
};

export default SeoSection;
