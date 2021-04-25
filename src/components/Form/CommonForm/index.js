import React from 'react'
import { FormRules } from '_tools/validator'
import {
  Row,
  Col,
  Modal,
  Form
} from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item
const CommonForm = props => {
  const {onOk, commonFormVisible, changeCommonFormVisible, commonFormButton, index, Input} = props
  const formBuilder = commonFormButton.form
  const formTitle = formBuilder?.title ? formBuilder.title : commonFormButton.title
  const [form] = Form.useForm()
  const okHandle = () => {
    form.validateFields().then((value) => {
      const filter = Object.keys(value).filter(k => value[k])
      if (filter.length) {
        onOk(value, commonFormButton.index).then(res => {
          if (res?.success) {
            changeCommonFormVisible(false, {})
            form.resetFields()
          }
        })
      }
    })
  }

  const oneColumn = formBuilder?.fields?.map(function (item, i) {
    const flex = item?.title?.length > 5 ? (item?.title?.length + 1) * 14 : 84
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
      formBuilder?.fields?.map(function (item, i) {
        return (
          <Col span={12} key={i}>
            <FormItem labelCol={{flex: `${(item?.title?.length + 1) * 14}px`}}
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
      title={formTitle}
      width={formBuilder?.fields?.length >= 8 ? 800 : 550}
      visible={commonFormVisible[index]}
      onOk={okHandle}
      onCancel={() => changeCommonFormVisible(false, {})}
      cancelText={formBuilder?.cancel_title}
      okText={formBuilder?.confirm_title}
    >
      <Form initialValues={{}} form={form}>
        {formBuilder?.fields?.length >= 8 ? TwoColumn : oneColumn}
      </Form>
    </Modal>

  )
}
export default connect(({'@@container': {commonFormVisible, commonFormButton}}) => ({
  commonFormVisible, commonFormButton
}))(CommonForm)
