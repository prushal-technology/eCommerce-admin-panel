import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const InfoTooltip = ({ title, text }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    <span>{title}</span>

    <Tooltip title={text} placement="top">
      <InfoCircleOutlined
        style={{
          color: "#8c8c8c",
          cursor: "pointer",
          fontSize: 14,
        }}
      />
    </Tooltip>
  </span>
);

export default InfoTooltip;