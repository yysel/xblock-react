import React from 'react';

export default (props) => {
  const {button: {color, title}, onClick} = props;
  const style = {
    color: '#fff',
    cursor: 'pointer',
    padding: '2px 8px',
    borderRadius: 4,
    backgroundColor: (color && color !== 'primary') ? color : 'var(--primary-color)',
  };
  return <span className='xblock-element-small-button' style={style}
               onClick={onClick}>{title}</span>;
}
