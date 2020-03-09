import { Input, InputNumber } from 'antd';
import React from 'react';

export default function({ header = {}, value, onChange, disabled = true, type = 'filter', ...rest }) {
  if (header.value_type === 'number') {
    return (
      <InputNumber value={value} onChange={onChange} disabled={disabled} key={header.index}
                   placeholder="请输入" style={{ width: '100%' }} {...rest} />);
  } else {
    return (<Input placeholder="请输入"
                   key={header.index}
                   disabled={disabled}
                   value={value}
                   onChange={onChange}
                   {...rest} />);
  }
};
