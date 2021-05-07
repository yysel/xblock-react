import React from 'react'
import {Modal, Result} from 'antd'
import Table from '../../blocks/Table'
import InnerButton from '_elements/Button/InnerButton'
import TopButton from '_elements/Button/TopButton'
import Input from '_elements/Input'
import Cell from '_elements/Cell'
import blockStructure from '_tools/block'
import {checkCode} from '_tools/response'

const {error, success} = Modal

export default function (res, dispatch) {
  const {success: result, message, data} = res
  if (result) {
    return success({
      title: '导入成功',
      footer: null,
      width: 650,
      content: <Result status={'success'} title={`成功导入 ${data} 条数据 `}/>
    })
  } else {
    const block = data?.block
    if (block) {
      blockStructure(data?.block)
      const {index, primary_key: primaryKey} = block
      const props = {
        key: block.index,
        block,
        event: {},
        InnerButton: (props) => <InnerButton button={block.getInnerButton()} {...props}/>,
        TopButton: (props) => <TopButton button={block.getTopButton()} dispatch={dispatch}
                                         primaryKey={primaryKey} {...props}/>,
        Input: (props) => <Input index={index} {...props} primaryKey={primaryKey}/>,
        Cell: (props) => <Cell index={index} dispatch={dispatch} primaryKey={primaryKey} {...props}/>,
      }
      return error({
        content: <Table {...props} scroll={{y: 600}}/>,
        width: '1000px',
        footer: null,
        title: <span>导入成功
          <span style={{color: 'var(--success-color)', fontWeight: 'bold'}}> {data?.success} </span>条，失败
          <span style={{color: 'var(--error-color)', fontWeight: 'bold'}}> {data?.error} </span>条，详情如下：
        </span>
      })
    } else checkCode(res)

  }

}
