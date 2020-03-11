import React from 'react'
import { Field, FormRule } from '../../../elements'
import {
  Row,
  Col,
  Modal,
  Form
} from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item
const AddForm = props => {
  const {onOk, addFormVisible, header, changeAddFormVisible, index, blockConfig} = props
  const [form] = Form.useForm()
  const okHandle = () => {
    form.validateFields().then((value) => {
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

  const oneColumn = header.map(function (item, i) {
    return (
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} key={i} label={item.title} name={item.index}
                rules={FormRule(item)}>
        <Field header={item} mode={'add'} index={index}
               extension={blockConfig?.header ? blockConfig.header : {}}/>

      </FormItem>
    )
  })
  const TwoColumn = <div>
    <Row gutter={24}>{
      header.map(function (item, i) {
        return (
          <Col span={12} key={i}>
            <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label={item.title} name={item.index}
                      rules={FormRule(item)}>
              <Field header={item} mode={'add'} index={index}
                     extension={blockConfig?.header ? blockConfig.header : {}}/>

            </FormItem>
          </Col>
        )
      })
    }</Row>
  </div>

  return (

    <Modal
      title="新增"
      width={header.length > 10 ? 800 : 600}
      visible={addFormVisible[index]}
      onOk={okHandle}
      onCancel={() => changeAddFormVisible(false)}
    >
      <Form initialValues={{}} form={form}>
        {header.length > 10 ? TwoColumn : oneColumn}
      </Form>
    </Modal>

  )
}
export default connect(({'@@container': {addFormVisible}}) => ({
  addFormVisible,
}))(AddForm)
