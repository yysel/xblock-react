import React from 'react';
import {Select} from 'antd';

const {Option} = Select;

export default function ({header: {dict}, value = [], onChange}) {
  return <Select value={value instanceof Array ? value : []}
                 mode="multiple" style={{width: '100%'}}
                 allowClear
                 showArrow
                 placeholder="请选择"
                 optionFilterProp='title'
                 onChange={onChange}>
    {dict.map(item => <Option
      key={item.value} title={item.text}>{item.text}</Option>)}
  </Select>;
}
