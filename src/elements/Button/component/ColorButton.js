import {Icon} from '@ant-design/compatible'
import React from 'react'

export default (props) => {
  const {color, children, icon, loading, ...rest} = props
  const text = children?.length === 2 && !icon ? children[0] + ' ' + children[1] : children
  const style = {
    // width: 82 + children.length * 2,
    height: 32,
    padding: '0 16px',
    margin: '0 5px'
  }
  if (color && color !== 'primary') style.backgroundColor = color
  let showIcon = icon ? icon : null;
  showIcon = loading ? 'loading' : showIcon;
  return <span className='xblock-element-color-button' style={style}
  >{icon && <Icon type={showIcon}/>} <span style={children.length === 2 ? {letterSpacing: 5} : {}}>{text}</span>
  </span>
};
