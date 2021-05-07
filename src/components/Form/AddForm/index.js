import React from 'react'
import {FormRules} from '_tools/validator'
import {
  Row,
  Col,
  Modal,
  Form
} from 'antd'
import {connect} from 'dva'

const FormItem = Form.Item
const AddForm = props => {
  const {onOk, addFormVisible, header, changeAddFormVisible, index, Input, loading} = props
  const [form] = Form.useForm()
  const initValue = {}
  header.forEach(i => {
    if (i.default) initValue[i.index] = i.default
  })
  const okHandle = () => {
    return form.validateFields().then((value) => {
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
    const flex = item.title.length > 5 ? (item.title.length + 1) * 14 : 84
    return (
      <div style={{padding: '0 50px'}} key={i}>
        <FormItem labelCol={{flex: `${flex}px`}}
                  wrapperCol={{flex: 'auto'}}
                  labelAlign='left'
                  extra={item.description}
                  label={item.title}
                  name={item.index}
                  rules={FormRules(item)}>
          <Input header={item} mode={'add'}/>

        </FormItem>
      </div>

    )
  })
  const TwoColumn = <div>
    <Row gutter={24}>{
      header.map(function (item, i) {
        return (
          <Col span={12} key={i}>
            <FormItem labelCol={{flex: `${(item.title.length + 1) * 14}px`}}
                      extra={item.description}
                      wrapperCol={{flex: 'auto'}}
                      label={item.title}
                      name={item.index}
                      rules={FormRules(item)}>
              <Input header={item} mode={'add'}/>

            </FormItem>
          </Col>
        )
      })
    }</Row>
  </div>

  return (

    <Modal
      title="新增"
      width={header.length >= 8 ? 800 : 550}
      visible={addFormVisible[index]}
      onOk={okHandle}
      okButtonProps={{loading}}
      onCancel={() => changeAddFormVisible(false)}
    >
      <Form initialValues={initValue} form={form}>
        {header.length >= 8 ? TwoColumn : oneColumn}
      </Form>
    </Modal>

  )
}
export default connect(({'@@container': {addFormVisible}}) => ({
  addFormVisible,
}))(AddForm)
