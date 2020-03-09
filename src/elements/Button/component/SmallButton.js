import React from 'react';
import styles from '_style/element.less';

export default (props) => {
  const { button: { color, title }, onClick } = props;
  const style = {
    color: '#fff',
    cursor: 'pointer',
    padding: '2px 8px',
    borderRadius: 4,
    backgroundColor: (color && color !== 'primary') ? color: 'var(--primary-color)',
  };
  return <span className={styles.buttonClick} style={style}
               onClick={onClick}>{title}</span>;
}
