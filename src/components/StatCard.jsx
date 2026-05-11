import React from 'react';
import { Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatCard = ({ 
  title, 
  value, 
  prefix, 
  suffix, 
  precision = 0,
  change = 0,
  changeText,
  color = '#1890ff',
  loading = false,
  icon
}) => {
  const getChangeColor = (changeValue) => {
    if (changeValue > 0) return '#52c41a';
    if (changeValue < 0) return '#ff4d4f';
    return '#666';
  };

  const getChangeIcon = (changeValue) => {
    if (changeValue > 0) return <ArrowUpOutlined />;
    if (changeValue < 0) return <ArrowDownOutlined />;
    return null;
  };

  return (
    <Card loading={loading}>
      <Statistic
        title={title}
        value={value}
        precision={precision}
        prefix={prefix}
        suffix={
          <Space>
            {suffix}
            {change !== 0 && (
              <span 
                style={{ 
                  fontSize: '12px', 
                  color: getChangeColor(change),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                {getChangeIcon(change)}
                {Math.abs(change)}%
              </span>
            )}
          </Space>
        }
        valueStyle={{ color }}
      />
      {changeText && (
        <div style={{ 
          marginTop: 8, 
          fontSize: '12px', 
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          {getChangeIcon(change)}
          {changeText}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
