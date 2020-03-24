import React from 'react'
import { Button, Drawer, Form } from 'antd'
import { FormRules } from '../../../tools/validator'
import { isUndefined } from '../../../tools/type'
import { connect } from 'dva'

const EditForm = function (props) {
  const {editFormVisible, header, changeEditFormVisible, value, onOk, index, Input, primaryKey = 'id'} = props
  const primary = {}
  primary[primaryKey] = value[primaryKey];
  function okHandle (value) {
    const filter = Object.keys(value).map(k => {
      if (isUndefined(value[k])) {
        value[k] = null
      }
    })
    if (filter.length) {
      onOk({...value, ...primary}).then(({success}) => {
        if (success) {
          changeEditFormVisible(false)
          form.resetFields()
        }
      })
    }

  }

  const EditBord = (
    <Drawer
      title={'编辑面板'}
      visible={editFormVisible[index]}
      onClose={() => changeEditFormVisible(false)}
      placement='right'
      width={500}
      getContainer={false}
    >
      <Form initialValues={value ? value : {}} onFinish={okHandle}>
        {header.map(function (column) {
          return (<Form.Item key={column.index} rules={FormRules(column)} name={column.index} labelCol={{span: 5}}
                             wrapperCol={{span: 15}} label={column.title}>
            <Input header={column} row={value} mode={'edit'}/>
          </Form.Item>)
        })}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button onClick={() => changeEditFormVisible(false)}>
            取消
          </Button>
          <Button type="primary" style={{marginLeft: 20}} htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    </Drawer>
  )

  return editFormVisible[index] ? EditBord : null
}

export default connect(({'@@container': {editFormVisible, editFormValue}}) => ({
  editFormVisible,
  value: editFormValue,
}))(EditForm)

