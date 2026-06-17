// components/AboutSection.jsx

import {
    Card,
    Form,
    Input,
    message,
} from 'antd';

import { useEffect, useState } from 'react';

import {
    getAboutSections,
    updateAboutSection,
} from '../../../api/cms';

import SaveButton from './SaveButton';

const { TextArea } = Input;

const AboutSection = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const res = await getAboutSections();

    if (res.success && res.abouts) {
      form.setFieldsValue(res.abouts);
    }
  };

  const handleSubmit = async (values) => {

    setLoading(true);

    try {

      const res = await updateAboutSection(values);

      if (res.success) {
        message.success('About updated');
      } else {
        message.error(res.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="About Section"
      style={{ marginBottom: 20 }}
      loading={loading}
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >

        <Form.Item
          label="Badge Text"
          name="badgeText"
        >
          <Input />
        </Form.Item>

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
          <TextArea rows={5} />
        </Form.Item>

        <SaveButton loading={loading}>
          Save About
        </SaveButton>

      </Form>

    </Card>
  );
};

export default AboutSection;
