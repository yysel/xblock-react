import { Icon } from '@ant-design/compatible'
import React from 'react'

export default (props) => {
  const {color, children, icon, ...rest} = props
  const text = children?.length === 2 && !icon ? children[0] + ' ' + children[1] : children
  const style = {
    // width: 82 + children.length * 2,
    height: 32,
    padding: '0 16px'
  }
  if (color && color !== 'primary') style.backgroundColor = color
  return <span className='xblock-element-color-button' style={style}
  >{icon && <Icon type={icon}/>} <span style={children.length === 2 ? {letterSpacing: 5} : {}}>{text}</span>
  </span>
};
