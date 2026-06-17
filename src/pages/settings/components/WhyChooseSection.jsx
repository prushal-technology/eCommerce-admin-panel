
// components/WhyChooseSection.jsx

import {
    Card,
    Form,
    Input,
    message,
} from 'antd';

import { useEffect, useState } from 'react';

import {
    getWhyChooseUs,
    updateWhyChooseUs,
} from '../../../api/cms';


import SaveButton from './SaveButton';

const { TextArea } = Input;

const WhyChooseSection = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const res = await getWhyChooseUs();

    if (res.success && res.sections) {
      form.setFieldsValue(res.sections);
    }
  };

  const handleSubmit = async (values) => {

    setLoading(true);

    try {

      const res = await updateWhyChooseUs(values);

      if (res.success) {
        message.success('Why Choose Us updated');
      } else {
        message.error(res.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Why Choose Us"
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
          <TextArea rows={4} />
        </Form.Item>

        <SaveButton loading={loading}>
          Save Why Choose Us
        </SaveButton>

      </Form>

    </Card>
  );
};

export default WhyChooseSection;