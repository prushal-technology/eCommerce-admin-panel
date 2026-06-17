// components/AboutStorySection.jsx

import {
    Button,
    Card,
    Form,
    Input,
    message,
    Upload,
} from 'antd';

import { useEffect, useState } from 'react';

import {
    getAboutStorySections,
    updateAboutStorySection,
} from '../../../api/cms';

import SaveButton from './SaveButton';

const { TextArea } = Input;

const AboutStorySection = () => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        const res = await getAboutStorySections();

        if (res.success && res.stories) {
            form.setFieldsValue(res.stories);
        }
    };


    const handleSubmit = async (values) => {

        setLoading(true);

        try {

            const payload = {
                ...values,
                image:
                    values.image?.fileList?.[0]?.originFileObj || null,
            };

            const res = await updateAboutStorySection(payload);

            if (res.success) {
                message.success('Story updated');
            } else {
                message.error(res.message);
            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <Card
            title="About Story Section"
            style={{ marginBottom: 20 }}
            loading={loading}
        >

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >

                <Form.Item
                    label="Section Tag"
                    name="sectionTag"
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
                    label="Description 1"
                    name="description1"
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Description 2"
                    name="description2"
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Image Alt"
                    name="imageAlt"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Story Image"
                    name="image"
                    value='fileList'
                >

                    <Upload beforeUpload={() => false}>
                        <Button type="secondary" size="small">
                            Upload Image
                        </Button>
                    </Upload>

                </Form.Item>

                <SaveButton loading={loading}>
                    Save Story
                </SaveButton>

            </Form>

        </Card>
    );
};

export default AboutStorySection;