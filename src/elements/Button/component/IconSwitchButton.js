import React from 'react'
import {Modal, Tooltip} from 'antd'
import {Icon} from '@ant-design/compatible'

export default function ({
                           value,
                           primaryKey,
                           event: {edit},
                           button: {index, title, confirm_description = '该操作锁定数据，是否继续？'}
                         }) {
  const editValue = {}
  editValue[primaryKey] = value[primaryKey]
  return <Tooltip placement="top" title={title} autoAdjustOverflow>
    <Icon type={value?.[index] ? 'unlock' : 'lock'}
          style={{color: value?.[index] ? 'var(--primary-color)' : '#bababa', fontSize: '20px'}}
          theme='filled'
          onClick={(e) => {
            e.stopPropagation()
            editValue[index] = !value?.[index]
            if (value?.[index]) {
              Modal.confirm({
                title: '操作提示',
                content: confirm_description,
                onOk() {
                  edit(editValue)
                },
              })
            } else edit(editValue)
          }}/></Tooltip>
}
