import {
    MailOutlined,
    MessageOutlined,
    PhoneOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Card,
    Input,
    message,
    Skeleton,
    Space,
    Table,
    Tabs,
    Tooltip,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAllContactForms, getAllNewsletterSubscribers } from '../api/cms';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const PAGE_SIZE_CONTACTS = 20;
const PAGE_SIZE_NEWSLETTER = 20;
const DEBOUNCE_MS = 400;

// ── Debounce hook ─────────────────────────────────────────────────────────────
const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
};

// ── Skeleton helpers ──────────────────────────────────────────────────────────
const SkeletonCell = ({ width = 120 }) => (
    <Skeleton.Input active size="small" style={{ width, height: 14, borderRadius: 4 }} />
);

const makeSkeletonRows = (n, prefix) =>
    Array.from({ length: 11 }, (_, i) => ({ id: `${prefix}-skel-${i}`, isSkeleton: true }));

// ── Scroll sentinel ───────────────────────────────────────────────────────────
const ScrollSentinel = ({ onIntersect }) => {
    const ref = useRef(null);
    useEffect(() => {
        if (!ref.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) onIntersect(); },
            { threshold: 0.1 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [onIntersect]);
    return <div ref={ref} style={{ height: 1 }} />;
};

// ── Scrollable table wrapper ──────────────────────────────────────────────────
const ScrollTable = ({ columns, dataSource, rowKey, locale, loadingMore, hasMore, onLoadMore, scrollY = 440 }) => (
    <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={false}
        scroll={{ x: 'max-content', y: scrollY }}
        locale={locale}
        footer={() =>
            loadingMore ? (
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <Skeleton.Input active size="small" style={{ width: 180, height: 14, borderRadius: 4 }} />
                </div>
            ) : hasMore ? (
                <ScrollSentinel onIntersect={onLoadMore} />
            ) : null
        }
    />
);

// ── Contact Forms tab ─────────────────────────────────────────────────────────
const ContactFormsTab = ({ onCountChange }) => {
    const [contacts, setContacts] = useState([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    const debouncedSearch = useDebounce(searchInput, DEBOUNCE_MS);

    const fetchContacts = useCallback(async ({ cursor = null, searchVal = '', append = false } = {}) => {
        append ? setLoadingMore(true) : setInitialLoading(true);
        try {
            const res = await getAllContactForms({
                first: PAGE_SIZE_CONTACTS,
                after: cursor,
                search: searchVal,
            });
            if (res.success) {
                setContacts((prev) => append ? [...prev, ...res.contacts] : res.contacts);
                setNextCursor(res.nextCursor);
                setHasMore(res.hasMore);
                if (!cursor && !searchVal) onCountChange?.(res.contacts.length);
            } else {
                message.error(res.message || 'Failed to load contact forms');
            }
        } finally {
            append ? setLoadingMore(false) : setInitialLoading(false);
        }
    }, [onCountChange]);

    // Re-fetch whenever debounced search value changes
    useEffect(() => {
        setContacts([]);
        fetchContacts({ searchVal: debouncedSearch });
    }, [debouncedSearch]);

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingMore) return;
        fetchContacts({ cursor: nextCursor, searchVal: debouncedSearch, append: true });
    }, [hasMore, loadingMore, nextCursor, debouncedSearch, fetchContacts]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 160,
            render: (name, r) =>
                r.isSkeleton ? <SkeletonCell width={120} /> : (
                    <Space size={6}>
                        <UserOutlined style={{ color: '#8c8c8c' }} />
                        <Text strong style={{ fontSize: 13 }}>{name || '—'}</Text>
                    </Space>
                ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 210,
            render: (email, r) =>
                r.isSkeleton ? <SkeletonCell width={160} /> : (
                    <Space size={6}>
                        <MailOutlined style={{ color: '#8c8c8c' }} />
                        <Text style={{ color: '#1890ff', fontSize: 13 }}>{email || '—'}</Text>
                    </Space>
                ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
            render: (phone, r) =>
                r.isSkeleton ? <SkeletonCell width={100} /> : (
                    <Space size={6}>
                        <PhoneOutlined style={{ color: '#8c8c8c' }} />
                        <Text style={{ fontSize: 13 }}>{phone || '—'}</Text>
                    </Space>
                ),
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
            render: (msg, r) =>
                r.isSkeleton ? <SkeletonCell width={280} /> : (
                    <Tooltip title={msg} placement="topLeft">
                        <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ marginBottom: 0, fontSize: 13 }}
                        >
                            {msg || '—'}
                        </Paragraph>
                    </Tooltip>
                ),
        },
        {
            title: 'Received',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 155,
            render: (date, r) =>
                r.isSkeleton ? <SkeletonCell width={120} /> : (
                    <Text style={{ fontSize: 13, color: '#595959' }}>
                        {dayjs(date).format('MMM D, YYYY h:mm A')}
                    </Text>
                ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Search
                    size="small"
                    placeholder="Search by name, email, phone or message..."
                    allowClear
                    style={{ width: 320 }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onClear={() => setSearchInput('')}
                />
            </div>

            <ScrollTable
                columns={columns}
                dataSource={initialLoading ? makeSkeletonRows(8, 'contact') : contacts}
                rowKey="id"
                locale={{ emptyText: 'No contact form submissions yet' }}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                scrollY={440}
            />
        </div>
    );
};

// ── Newsletter Subscribers tab ────────────────────────────────────────────────
const NewsletterTab = ({ onCountChange }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    const fetchSubscribers = useCallback(async ({ cursor = null, append = false } = {}) => {
        append ? setLoadingMore(true) : setInitialLoading(true);
        try {
            const res = await getAllNewsletterSubscribers({
                first: PAGE_SIZE_NEWSLETTER,
                after: cursor,
            });
            if (res.success) {
                setSubscribers((prev) => append ? [...prev, ...res.subscribers] : res.subscribers);
                setNextCursor(res.nextCursor);
                setHasMore(res.hasMore);
                if (!cursor) onCountChange?.(res.subscribers.length);
            } else {
                message.error(res.message || 'Failed to load subscribers');
            }
        } finally {
            append ? setLoadingMore(false) : setInitialLoading(false);
        }
    }, [onCountChange]);

    useEffect(() => { fetchSubscribers(); }, []);

    const handleLoadMore = useCallback(() => {
        if (!hasMore || loadingMore) return;
        fetchSubscribers({ cursor: nextCursor, append: true });
    }, [hasMore, loadingMore, nextCursor, fetchSubscribers]);

    const columns = [
        {
            title: 'S No',
            key: 'index',
            width: 52,
            render: (_, __, index) => (
                <Text type="secondary" style={{ fontSize: 12 }}>{index + 1}</Text>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email, r) =>
                r.isSkeleton ? <SkeletonCell width={220} /> : (
                    <Space size={6}>
                        <MailOutlined style={{ color: '#8c8c8c' }} />
                        <Text style={{ color: '#1890ff', fontSize: 13 }}>{email || '—'}</Text>
                    </Space>
                ),
        },
        {
            title: 'Subscribed At',
            dataIndex: 'subscribedAt',
            key: 'subscribedAt',
            width: 180,
            render: (date, r) =>
                r.isSkeleton ? <SkeletonCell width={140} /> : (
                    <Text style={{ fontSize: 13, color: '#595959' }}>
                        {date ? dayjs(date).format('MMM D, YYYY h:mm A') : '—'}
                    </Text>
                ),
        },
    ];

    return (
        <ScrollTable
            columns={columns}
            dataSource={initialLoading ? makeSkeletonRows(8, 'newsletter') : subscribers}
            rowKey="id"
            locale={{ emptyText: 'No newsletter subscribers yet' }}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            scrollY={440}
        />
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const Enquiries = () => {
    const [contactCount, setContactCount] = useState(null);
    const [subscriberCount, setSubscriberCount] = useState(null);

    const tabLabel = (label, icon) => (
        <Space size={6}>
            {icon}
            {label}
            {/* {count !== null && (
                <Badge
                    count={count}
                    style={{ backgroundColor: '#1890ff', fontSize: 10 }}
                    overflowCount={999}
                />
            )} */}
        </Space>
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Title level={4} style={{ marginBottom: 20 }}>Enquiries</Title>

            <Card
                style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}
                styles={{ body: { flex: 1, overflow: 'auto', minHeight: 0, paddingTop: 0 } }}
            >
                <Tabs
                    defaultActiveKey="contact"
                    size="small"
                    items={[
                        {
                            key: 'contact',
                            label: tabLabel('Contact Forms', <MessageOutlined />),
                            children: <ContactFormsTab onCountChange={setContactCount} />,
                        },
                        {
                            key: 'newsletter',
                            label: tabLabel('Newsletter', <MailOutlined />),
                            children: <NewsletterTab onCountChange={setSubscriberCount} />,
                        },
                    ]}
                />
            </Card>
        </div>
    );
};

export default Enquiries;