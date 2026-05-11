import React from "react";
import { Tag } from "antd";

const ApplicationTag = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <Tag style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        FREE VERSION v1.0.0
      </Tag>
    </div>
  );
};

export default ApplicationTag;
