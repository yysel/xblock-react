import React from 'react';
import {Checkbox} from 'antd';

const {Group} = Checkbox;

export default function ({header: {dict}, value = [], onChange}) {

  return <Group value={value instanceof Array ? value : []}
                mode="multiple" style={{width: '100%'}}
                allowClear
                showArrow
                placeholder="请选择"
                optionFilterProp='title'
                onChange={onChange}>
    {dict.map(item => <Checkbox
      value={item.value} title={item.text}>{item.text}</Checkbox>)}
  </Group>;
}
