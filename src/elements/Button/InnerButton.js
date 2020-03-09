import React from 'react';
import styles from '../../styles/element.less';
import registerState from '../../xblock/registerState';
import { Popconfirm } from 'antd';
const getButton=(key)=> {
  const button = registerState.button.find(item => item.key === key);
  return button?.component ? button.component : null;
}


export default function InnerButton(props) {
  const { button = [], extension = {}, onClick, value = {},event, style, buttonStatue = {} } = props;
  return (
    <div className={styles.bottomButton} style={style}>
      {button.map((item, key) => {
        const { title, index, confirm, component } = item;
        const buttonProps = {
          button: item,
          value,
          index,
          title,
          event,
          key
        };
        let ButtonComponent = getButton(component);
        let DefaultButton = <ButtonComponent {...buttonProps} > {title} </ButtonComponent>;
        if (extension[index]) ButtonComponent = extension[index];
        if (buttonStatue.hasOwnProperty(index) && !buttonStatue[index]) return null;
        return confirm ?
          <Popconfirm key={index} title={`确定要${title}？`} onCancel={(e) => {
            e.stopPropagation();
          }} onConfirm={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
                      okText="确定" cancelText="取消" name={value.id}>
            <span onClick={e => e.stopPropagation()} className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title} </ButtonComponent>
            </span>
          </Popconfirm> : (<span onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }} className={styles.bottomButtonItem} key={index}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
          </span>);
      })}
    </div>);
}
