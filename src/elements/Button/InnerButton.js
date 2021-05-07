import React from 'react'
import registerState from '../../xblock/registerState'
import {Popconfirm} from 'antd'

const getButton = (key) => {
  const button = registerState.button.find(item => item.key === key)
  return button?.component ? button.component : null
}

export default function InnerButton(props) {
  const {button = [], extension = {}, onClick, value = {}, event, style, primaryKey, buttonStatue = {}} = props
  return (
    <div className='xblock-element-inner-button' style={style}>
      {button.map((item, key) => {
        const {title, index, confirm, component} = item
        const buttonProps = {
          button: item,
          value,
          index,
          title,
          event,
          primaryKey,
          key
        }
        let ButtonComponent = getButton(component)
        let DefaultButton = <ButtonComponent {...buttonProps} > {title} </ButtonComponent>
        if (extension[index]) ButtonComponent = extension[index]
        if (buttonStatue.hasOwnProperty(index) && !buttonStatue[index]) return null
        return confirm ?
          <Popconfirm key={index} title={`确定要${title}？`} onCancel={(e) => {
            e.stopPropagation()
          }} onConfirm={(e) => {
            e.stopPropagation()
            onClick(item)
          }}
                      okText="确定" cancelText="取消" name={value.id}>
            <span onClick={e => e.stopPropagation()} className='item'>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title} </ButtonComponent>
            </span>
          </Popconfirm> : (<span onClick={(e) => {
            e.stopPropagation()
            onClick(item)
          }} className='item' key={index}>
            <ButtonComponent {...buttonProps} DefaultButton={DefaultButton}> {title}</ButtonComponent>
          </span>)
      })}
    </div>)
}
