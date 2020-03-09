import React from 'react';
import styles from '../../styles/element.less';
import { Dropdown, Menu, Popconfirm ,Button} from 'antd';
import ButtonRegister from '../register';
import {  Icon} from '@ant-design/compatible'
export default function TopButton(props) {
  const { button, spread = true, extension = {}, event, onClick, value = {}, style = {} } = props;
  return (button.length < 4 || spread) ? (
    <div style={style}>
      {button.map((item) => {
        const { title, index, confirm, component } = item;
        const buttonProps = {
          button: item,
          value,
          index,
          title,
          event,
        };
        let ButtonComponent = ButtonRegister.getButton(component);
        let DefaultButton = <ButtonComponent {...buttonProps} > {title}</ButtonComponent>;
        if (extension[index]) ButtonComponent = extension[index];
        return confirm ?
          <Popconfirm key={index} title={`确定要${title}？`} onConfirm={(e) => {
            e.stopPropagation();
            onClick(item);
          }} okText="确定" cancelText="取消" onCancel={(e) => {
            e.stopPropagation();
          }}
                      name={value.id}>
            <span className={styles.bottomButtonItem} onClick={e => e.stopPropagation()}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
              </span>
          </Popconfirm> : (<span key={index} onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }} className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
          </span>);
      })}
    </div>) : (
    <div style={style}>
      {button.filter((item, key) => {
        return key <= 1;
      }).map((item) => {
        const { title, index, confirm, component } = item;
        const buttonProps = {
          button: item,
          value,
          index,
          title,
          event,
        };
        let ButtonComponent = ButtonRegister.getButton(component);
        let DefaultButton = <ButtonComponent {...buttonProps}> {title}</ButtonComponent>;
        if (extension[index]) ButtonComponent = extension[index];
        return confirm ?
          <Popconfirm key={index} title={`确定要${title}？`} onConfirm={() => onClick(item)} okText="是" cancelText="否"
                      name={value.id}>
            <span className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
              </span>
          </Popconfirm> : (<span key={index} onClick={() => onClick(item)} className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
          </span>);
      })}
      <span style={{ marginLeft: 5 }}>
            <Dropdown overlay={<Menu>
              {button.filter((item, key) => {
                return key > 1;
              }).map(item => {
                return <Menu.Item key={index}
                                  onClick={() => onClick(item)}>{title}</Menu.Item>;
              })}
            </Menu>}>
              <Button type={'primary'}>更多操作 <Icon type="down"/></Button>
            </Dropdown>
      </span>
    </div>);
}
