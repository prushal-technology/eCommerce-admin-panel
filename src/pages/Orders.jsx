import React, { useState } from "react";
import { Table, Tag, Button } from "antd";

const Orders = () => {
  // =====================
  // Dummy Orders Array
  // =====================
  const [orders, setOrders] = useState([
    {
      id: "ORD-101",
      clientName: "ABC Pvt Ltd",
      project: "Website Development",
      amount: "₹50,000",
      status: "Pending",
      date: "2025-02-10",
    },
    {
      id: "ORD-102",
      clientName: "TechBuzz Solutions",
      project: "Digital Marketing",
      amount: "₹30,000",
      status: "Completed",
      date: "2025-02-12",
    },
    {
      id: "ORD-103",
      clientName: "Global Ventures",
      project: "CRM Development",
      amount: "₹80,000",
      status: "In Review",
      date: "2025-02-14",
    },
  ]);

  // =====================
  // Column Definitions
  // =====================
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Pending"
            ? "orange"
            : status === "Completed"
            ? "green"
            : "blue";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: () => <Button type="link">View</Button>,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders</h2>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        bordered
      />
    </div>
  );
};

export default Orders;
