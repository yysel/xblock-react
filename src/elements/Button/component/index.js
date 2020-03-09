import {Button as AntButton} from 'antd';
import { Icon } from '@ant-design/compatible'
import IconButton from 'rsuite/lib/Button';
import React from 'react';

export default (props) => {
  const {color, children, icon, ...rest} = props;
  const text = children.length === 2 && !icon ? children[0] + ' ' + children[1] : children;
  return color === 'primary' || !color ? <AntButton icon={icon} {...rest}  type={color} >{children}</AntButton> :
    <IconButton color={color}
                style={{fontSize: 14, height: 32, padding: '6px 21px', borderRadius: '4px', marginTop: '-3px'}}
                size="sm"
                icon={<Icon type={icon} style={{marginRight: 4}}/>} {...rest}  >{text}</IconButton>;
};
