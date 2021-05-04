import React from 'react'
import {FormRules} from '_tools/validator'
import {
  Row,
  Col,
  Modal,
  Form,
  Alert,
  Button
} from 'antd'
import {connect} from 'dva'
import TopButton from '_elements/Button/TopButton';

const FormItem = Form.Item
const CommonForm = props => {
  const {onOk, commonFormVisible, changeCommonFormVisible, commonFormButton, index, Input, commonFormValue, loading} = props
  const formBuilder = commonFormButton.form
  const currentLoading = loading[commonFormButton.index]
  const formTitle = formBuilder?.title ? formBuilder.title : commonFormButton.title
  const [form] = Form.useForm()

  formBuilder?.fields.forEach(i => {
    if (i.default && !commonFormValue[i.index]) commonFormValue[i.index] = i.default
  })
  const okHandle = (action = 'confirm') => {
    form.validateFields().then((value) => {
      const filter = Object.keys(value).filter(k => value[k]);
      onOk({...commonFormValue, ...filter, form_action: action}, commonFormButton.index).then(res => {
        if (res?.success) {
          changeCommonFormVisible(false, {})
          form.resetFields()
        }
      })
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
  const buttonProps = {
    event: props.event,
    dispatch: props.dispatch,
    primaryKey: props.dispatch,
    index: props.index,
    loading: props.loading,
    onClick: (b) => okHandle(b.index)
  }
  const info = <Alert
    message={formBuilder.info_title ? formBuilder.info_title : undefined}
    description={formBuilder.info}
    type={formBuilder.info_type ? formBuilder.info_type : 'info'}
    style={{margin: '20px 0'}}
  />
  const BottomButton = (props) => <TopButton button={formBuilder?.actions} {...buttonProps} {...props}/>
  return (

    <Modal
      title={formTitle}
      width={formBuilder?.fields?.length >= 8 ? 800 : 550}
      visible={commonFormVisible[index]}
      // visible={true}
      footer={formBuilder?.actions?.length ? <BottomButton/> : undefined}
      onOk={() => okHandle('confirm')}
      okButtonProps={{loading: currentLoading}}
      onCancel={() => changeCommonFormVisible(false, {})}
      cancelText={formBuilder?.cancel_title}
      okText={formBuilder?.confirm_title}
    >
      <Form initialValues={commonFormValue} form={form}>
        {(formBuilder.info && formBuilder.info_position === 'top') && info}
        {formBuilder?.fields?.length >= 8 ? TwoColumn : oneColumn}
        {(formBuilder.info && formBuilder.info_position === 'bottom') && info}
      </Form>
    </Modal>

  )
}
export default connect(({'@@container': {commonFormVisible, commonFormButton, commonFormValue}}) => ({
  commonFormVisible, commonFormButton, commonFormValue
}))(CommonForm)
