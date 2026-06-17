
// components/ContactSection.jsx

import {
    Card,
    Col,
    Form,
    Input,
    message,
    Row,
} from 'antd';

import { useEffect, useState } from 'react';

import {
    getContactInfo,
    updateContactInfo,
} from '../../../api/cms';

import SaveButton from './SaveButton';

const { TextArea } = Input;

const ContactSection = () => {

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const res = await getContactInfo();

    if (res.success && res.contacts) {
      form.setFieldsValue(res.contacts);
    }
  };

  const handleSubmit = async (values) => {

    setLoading(true);

    try {

      const payload = {
        ...values,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
      };

      const res = await updateContactInfo(payload);

      if (res.success) {
        message.success('Contact updated');
      } else {
        message.error(res.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Contact Information"
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
          label="Email"
          name="email"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Google Map Link"
          name="googleMapLink"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Google Map Embed URL"
          name="googleMapEmbedUrl"
        >
          <TextArea rows={3} />
        </Form.Item>

        <Row gutter={16}>

          <Col span={12}>

            <Form.Item
              label="Latitude"
              name="latitude"
            >
              <Input type="number" />
            </Form.Item>

          </Col>

          <Col span={12}>

            <Form.Item
              label="Longitude"
              name="longitude"
            >
              <Input type="number" />
            </Form.Item>

          </Col>

        </Row>

        <SaveButton loading={loading}>
          Save Contact Info
        </SaveButton>

      </Form>

    </Card>
  );
};

export default ContactSection;