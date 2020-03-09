import React from 'react'
import { Field, FormRule } from '../../../elements'
import {
  Row,
  Col,
  Modal,
} from 'antd'
import { connect } from 'dva'
import { Form } from '@ant-design/compatible'

const FormItem = Form.Item
const AddForm = Form.create()(props => {
  const {form, onOk, addFormVisible, header, changeAddFormVisible, index, blockConfig} = props
  const okHandle = () => {
    form.validateFields((err, value) => {
      if (err) return
      const filter = Object.keys(value).filter(k => value[k])
      if (filter.length) {
        onOk(value).then(res => {
          if (res?.success) {
            changeAddFormVisible(false)
            form.resetFields()
          }
        })
      }
    })
  }
  return (
    <Modal
      title="新增"
      width={'60%'}
      visible={addFormVisible[index]}
      onOk={okHandle}
      onCancel={() => changeAddFormVisible(false)}
    >

      <Row style={{height: '500px', overflowY: 'scroll'}}>
        {header.map(function (item) {
          return (
            <Col sm={24} md={24} lg={12} xl={12} key={item.index}>
              <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label={item.title}>
                {form.getFieldDecorator(item.index, {
                  rules: FormRule(item),
                  initialValue: item.default ? item.default : null,
                })(<Field header={item} mode={'add'} index={index}
                          extension={blockConfig?.header ? blockConfig.header : {}}/>)}
              </FormItem>
            </Col>)
        })}
      </Row>
    </Modal>
  )
})

export default connect(({"@@container": {addFormVisible}}) => ({
  addFormVisible,
}))(AddForm)
