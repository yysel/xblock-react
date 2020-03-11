import React from 'react';
import {
  Switch,
  Icon,
  Tooltip,
  Button as AntdButton,
  Modal,
} from 'antd';
import Button from './component/ColorButton';
import SmallButton from './component/SmallButton';
import IconSwitchButton from './component/IconSwitchButton';
import styles from '../../styles/element.less';

export default [
  {
    title: '按钮',
    key: 'large',
    component: (props) => {
      const { value, button, index, ...rest } = props;
      return <Button icon={button.icon} type={button.component} color={button.color} {...rest} >{button.title}</Button>;
    },
  },
  {
    title: '小按钮',
    key: 'small',
    component: SmallButton,
  },
  {
    title: '文字',
    key: 'link',
    component: (props) => {
      const { button } = props;
      const style = button.color ? { color: button.color, textDecoration: 'none' } : { textDecoration: 'none' };
      return (<a style={style}>{button.title}</a>);
    },
  },
  {
    title: '警告',
    key: 'warning',
    component: (props) => {
      const { button, index, onClick } = props;
      return <AntdButton type="danger"> {button.title}</AntdButton>;
    },
  },
  {
    title: '图标',
    key: 'icon',
    component: (props) => {
      const { button, onClick } = props;
      return (
        <span>
          <Tooltip placement="top" title={button.title}>
            <Icon type={button.icon} onClick={onClick}
                  style={{ fontSize: 22, color: button.color ? button.color : 'var(--primary-color)' }}/>
         </Tooltip>
      </span>);
    },
  },
  {
    title: '填充背景色图标',
    key: 'solid_icon',
    component: (props) => {
      const { button, onClick } = props;
      return (<Tooltip placement="top" title={button.title} autoAdjustOverflow>
        <span className={styles.buttonClick} style={{
          display: 'inline-block',
          backgroundColor: (!button.color || button.color === 'primary') ? 'var(--primary-color)' : button.color,
          textAlign: 'center',
          lineHeight: '24px',
          height: '24px',
          borderRadius: '5px',
          color: '#fff',
          cursor: 'pointer',
          padding: '0px 6px',
        }}>
            <Icon type={button.icon} onClick={onClick}
                  style={{ color: '#ffffff', fontSize: '16px' }}/>
      </span> </Tooltip>);
    },
  },
  {
    title: '开关',
    key: 'switch',
    component: (props) => {
      const { value, event: { edit }, button: { index } } = props;
      return <Switch checked={value?.[index]} onClick={(v, e) => {
        e.stopPropagation();
        const editValue = { uuid: value.uuid };
        editValue[index] = v;
        edit(editValue);
      }}/>;
    },
  },
  {
    title: '图标开关',
    key: 'switch_icon',
    component: IconSwitchButton,
  },

];
