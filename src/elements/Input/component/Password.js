import {Input} from 'antd';
import React from 'react';

const {Password} = Input;
export default function ({header = {}, value, onChange, disabled = true, type = 'filter', ...rest}) {

  return (<Password placeholder="请输入"
                    key={header.index}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    {...rest} />);

};
