import React from 'react';
import { Spin, Alert } from 'antd';

export default function({ children, loading }) {
  if (!loading) return children;
  return <Spin>
    {children}
  </Spin>;
}
