import React from 'react'
import styles from '../../styles/element.less'
import {Dropdown, Menu, Popconfirm, Button} from 'antd'
import {DownOutlined} from '@ant-design/icons'
import registerState from '../../xblock/registerState'

const getButton = (key) => {
  const button = registerState.button.find(item => item.key === key)
  return button?.component ? button.component : null
}

export default function TopButton(props) {
  const {
    button: btn,
    spread = true,
    loading = {},
    extension = {},
    event,
    onClick,
    value = {},
    style = {},
    primaryKey
  } = props
  const button = btn.filter(i => i.visible)
  return (button.length < 4 || spread) ? (
    <span style={style}>
      {button.map((item) => {
        const {title, index, confirm, component} = item
        const currentLoading = loading[index]
        const buttonProps = {
          button: item,
          value,
          index,
          title,
          event,
          primaryKey,
          loading: currentLoading
        }
        let ButtonComponent = getButton(component)
        let DefaultButton = <ButtonComponent {...buttonProps} > {title}</ButtonComponent>
        if (extension[index]) ButtonComponent = extension[index]
        return confirm ?
          <Popconfirm key={index} title={`确定要${title}？`} onConfirm={(e) => {
            e.stopPropagation()
            if (currentLoading) return;
            return onClick(item)
          }} okText="确定" cancelText="取消" onCancel={(e) => {
            if (currentLoading) return;
            e.stopPropagation()
          }}
                      name={value.id}>
            <span className={styles.bottomButtonItem} onClick={e => {
              if (currentLoading) return;
              e.stopPropagation()
            }}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
              </span>
          </Popconfirm> : (<span key={index} onClick={(e) => {
            e.stopPropagation()
            if (currentLoading) return;
            return onClick(item)
          }} className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
          </span>)
      })}
    </span>) : (
    <div style={style}>
      {button.filter((item, key) => {
        return key <= 1
      }).map((item) => {
        const {title, index, confirm, component} = item
        const currentLoading = loading[index]
        const buttonProps = {
          button: item,
          value,
          index,
          title,
          event,
          loading: currentLoading
        }
        let ButtonComponent = getButton(component)
        let DefaultButton = <ButtonComponent {...buttonProps}> {title}</ButtonComponent>
        if (extension[index]) ButtonComponent = extension[index]
        return confirm ?
          <Popconfirm key={index} title={`确定要${title}？`} onConfirm={() => {
            e.stopPropagation()
            if (currentLoading) return;
            return onClick(item)
          }} okText="是" cancelText="否"
                      name={value.id}>
            <span className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
              </span>
          </Popconfirm> : (<span key={index} onClick={() => {
            e.stopPropagation()
            if (currentLoading) return;
            return onClick(item)
          }} className={styles.bottomButtonItem}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
          </span>)
      })}
      <span style={{marginLeft: 5}}>
            <Dropdown overlay={<Menu>
              {button.filter((item, key) => {
                return key > 1
              }).map(item => {
                const currentLoading = loading[index]
                return <Menu.Item key={index}
                                  onClick={() => {
                                    e.stopPropagation()
                                    if (currentLoading) return;
                                    return onClick(item)
                                  }}>{title}</Menu.Item>
              })}
            </Menu>}>
              <Button type={'primary'}>更多操作 <DownOutlined/></Button>
            </Dropdown>
      </span>
    </div>)
}
