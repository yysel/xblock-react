import {Input} from 'antd';

const {TextArea} = Input;
import React from 'react';

export default function ({
                           header = {},
                           value,
                           onChange,
                           disabled = true,
                           type = 'filter',
                           dispatch,
                           id,
                           index,
                           mode,
                           parentValue,
                           primaryKey,
                           resetChildrenValue,
                           ...rest
                         }) {
  return <TextArea placeholder="请输入" key={header.index} value={value} onChange={onChange}  {...rest}
                   disabled={disabled}/>;
}
