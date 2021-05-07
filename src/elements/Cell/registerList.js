import React from 'react'
import FileReader from './component/FileReader'
import {Tag, Switch} from 'antd'
import {Icon} from '@ant-design/compatible'
import {getTextFromHeader, goPage, color} from '_tools/helper'

export default [
  {
    title: '文本',
    key: 'text',
    component: ({value, row, header}) => {
      const text = getTextFromHeader(value, header.dict)
      return header.link ?
        <span onClick={() => goPage(header.link, row, true)}><a>{text}</a></span> :
        <span> {text}</span>
    },
  },
  {
    title: '文件',
    key: 'file',
    component: FileReader,
  },
  {
    title: '标签',
    key: 'tag',
    component: ({value, column, header: {dict = []}}) => {
      if (value instanceof Array) {
        return value.map(item => {
          const index = dict.findIndex(it => it.value == item)
          return (index > -1 ? <Tag
            color={dict?.[index]?.color ? dict[index].color : color[index % color.length]}>{dict[index].text}</Tag> : '-')
        })
      } else {
        const index = dict.findIndex(it => it.value == value)
        return index > -1 ? <Tag
          color={dict?.[index]?.color ? dict[index].color : color[index % color.length]}>{dict[index].text}</Tag> : value
      }
    },
  },
  {
    title: '彩色徽标',
    key: 'badge',
    component: ({value, column, header: {dict = []}, event}) => {
      if (value instanceof Array) {
        return value.map(item => {
          const index = dict.findIndex(it => it.value == item)
          return (index > -1 ? <Badge color={color[index % color.length]} text={dict[index].text}
                                      status={dict[index].status}/> : '-')
        })
      } else {
        const tag = dict.findIndex(it => it.value == value)
        return tag > -1 ?
          <Badge color={color[tag % color.length]} text={dict[tag].text}
                 status={dict[tag].status}/> : value
      }
    },
  },
  {
    title: '开关',
    key: 'switch',
    component: ({value, primaryKey, event: {edit}, row, header: {index}}) => {
      const editValue = {}
      editValue[primaryKey] = row[primaryKey]
      return <Switch checked={value} onClick={(v, e) => {
        e.stopPropagation()
        editValue[index] = v
        edit(editValue)
      }}/>
    },
  },
  {
    title: '性别',
    key: 'sex',
    component: ({value}) => {
      const isWoman = ['woman', '2', 2, '女', '女性', '女人', '妇女', '女孩', '女生'].indexOf(value) > -1
      const text = isWoman ? '女' : '男'
      const type = isWoman ? 'man' : 'woman'
      const color = isWoman ? '#ff4e95' : '#26a0f7'
      return <span><Icon type={type} style={{fontSize: 18, color, marginRight: 10}}/>{text}</span>
    },
  },
]
