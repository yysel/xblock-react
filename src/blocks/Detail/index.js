import React, { PureComponent } from 'react'
import { Descriptions, Col, Row, Form, Button } from 'antd'
import { FormRules } from '_tools/validator'
import Loading from '_components/Loading'

const FormItem = Form.Item
export default class CommonDetail extends PureComponent {
  state = {
    editStatus: false,
    validateFields: null,
    resetFields: null,

  }
  form = null

  onButtonClick (button, firstContent) {
    if (button.index === 'edit' && !this.props.block?.property?.open_edit) this.setState({editStatus: true})
    else this.props.onClick(button.index, {value: firstContent, button: button})
  }

  onEditButton = (value, uuid, onClick) => {
    const {block: {relation_index}, relationUuid} = this.props
    if (uuid) {
      if (onClick) onClick('edit', {
        value: {...value, uuid},
        button: {},
      }, {parameter: {}})
    } else {
      const newValue = {...value}
      newValue[relation_index] = relationUuid
      if (onClick) onClick('add', {value: newValue, button: {}}, {parameter: {}})
    }
  }

  submit (onClick) {
    const {validateFields, resetFields} = this.form
    validateFields().then((value) => {
      const filter = Object.keys(value).filter(k => value[k])
      if (filter.length) {
        if (onClick) onClick(value)
        resetFields()
        this.setState({editStatus: false})
      }
    })

  }

  render () {
    const {block: {content, header, property: {column = 3, has_border = false, open_edit = false}}, TopButton, InnerButton, onClick, Cell, Input, loading} = this.props
    const editStatus = open_edit ? true : this.state.editStatus
    const firstContent = content[0] ? content[0] : {}
    const EditBoard = props => {
      const [form] = Form.useForm()
      this.form = form
      return (
        <Form form={form} initialValues={firstContent}>
          <Descriptions bordered={has_border} column={Number(column)}>
            {header.filter(it => it.visible).map(item => (
              <Descriptions.Item
                label={item.unit ? item.title + '（' + item.unit + '）' : item.title}
                span={item.width === 0 ? 1 : item.width}>
                <FormItem style={{marginBottom: 0}} name={item.index} rules={FormRules(item)}>
                  <Input header={item} style={{width: '100%'}} mode={'edit'}/>
                </FormItem>
              </Descriptions.Item>))}
          </Descriptions>
        </Form>
      )
    }
    const Board = () => <Descriptions bordered={has_border} column={Number(column)}>
      {header.filter(it => it.visible).map(item => (
        <Descriptions.Item label={item.unit ? item.title + '（' + item.unit + '）' : item.title}
                           span={item.width === 0 ? 1 : item.width}>{<Cell value={firstContent[item.index]}
                                                                           header={item}
                                                                           row={firstContent}/>}</Descriptions.Item>))}
    </Descriptions>
    return <Loading loading={loading}>
      <Row>
        <Col style={{marginBottom: 20}} span={24}> <TopButton spread={false}
                                                              value={firstContent}
                                                              onClick={(button) => {
                                                                open_edit ? this.submit((value) => {
                                                                  this.onButtonClick(button, {
                                                                    ...value,
                                                                    uuid: firstContent.uuid,
                                                                  })
                                                                }) : this.onButtonClick(button, firstContent)
                                                              }}
        /></Col>
        <Col span={24}>
          {editStatus ? <EditBoard onClick={onClick}/> : <Board/>}
        </Col>
        {(editStatus && !open_edit) ? <Col span={24} style={{textAlign: 'center', marginTop: 50}}>
          <Button onClick={() => this.setState({editStatus: false})}>取 消</Button>
          <Button type="primary" style={{marginLeft: 8}}
                  onClick={() => this.submit((value) => this.onEditButton(value, firstContent.uuid, onClick))}>保
            存</Button>
        </Col> : <Col style={{marginTop: 50}}><InnerButton value={firstContent}
                                                           onClick={(button) => {
                                                             open_edit ? this.submit((value) => {
                                                               this.onButtonClick(button, {
                                                                 ...value,
                                                                 uuid: firstContent.uuid,
                                                               })
                                                             }) : this.onButtonClick(button, firstContent)
                                                           }}
        /></Col>}
      </Row>
    </Loading>
  }
}
