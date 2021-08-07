import React, {PureComponent} from 'react';
import {Radio as AntdRadio} from 'antd';

const RadioGroup = AntdRadio.Group;

export default class Radio extends PureComponent {
  render() {
    const {header, parentValue, onChange, ...rest} = this.props;
    const filterItem = header.parent ? header.dict.filter(item => (!parentValue) || item.parent == parentValue) : header.dict;
    return (
      <RadioGroup {...rest} onChange={(v) => onChange(v.target.value)} {...header?.property}>
        {filterItem.map((item) => {
          return (
            <AntdRadio style={{paddingLeft: 10}} key={item.value} value={item.value} {...header?.property.radio}>{item.text}</AntdRadio>
          );
        })}
      </RadioGroup>
    );
  }
}

