import React, {PureComponent, Fragment} from 'react'
import {Descriptions, Col, Row, Form, Button, Divider} from 'antd'
import {FormRules} from '_tools/validator'
import Loading from '_components/Loading'
import groupBy from 'lodash/groupBy'

const FormItem = Form.Item
export default class CommonDetail extends PureComponent {
  state = {
    editStatus: false,
    validateFields: null,
    resetFields: null,

  }
  form = null

  componentDidMount() {
    const {block} = this.props
    const first = block.getFirst();
    if (first) this.props.dispatch({
      type: '@@container/saveSelectedValue',
      value: first,
      index: block?.index
    })
  }

  onButtonClick(button, firstContent, block) {
    const {changeCommonFormVisible, onClick} = this.props
    if (button.form) return changeCommonFormVisible(true, button, firstContent)
    if (button.index === 'edit' && !block?.property?.open_edit) this.setState({editStatus: true})
    else onClick(button.index, {value: firstContent, button: button})
  }

  onEditButton = (value, primaryValue, onClick) => {
    const {block: {relation_index, primary_key}, relationUuid} = this.props
    const primary = {}
    primary[primary_key] = primaryValue
    if (primaryValue) {
      if (onClick) onClick('edit', {
        value: {...value, ...primary},
        button: {},
      }, {parameter: {}})
    } else {
      const newValue = {...value}
      newValue[relation_index] = relationUuid
      if (onClick) onClick('add', {value: newValue, button: {}}, {parameter: {}})
    }
  }

  submit(onClick) {
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

  render() {
    const {
      block: {content, header, primary_key, property: {column = 3, has_border = false, open_edit = false}},
      TopButton,
      InnerButton,
      onClick,
      Cell,
      Input,
      loading
    } = this.props
    const editStatus = open_edit ? true : this.state.editStatus
    const firstContent = content[0] ? content[0] : {}
    const primary = {}
    const primaryValue = primary[primary_key] = firstContent[primary_key]
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
    const visibleHeader = header.filter(it => it.visible)
    const data = groupBy(visibleHeader, 'group')
    const allGroupName = Object.keys(data)

    const Board = () => allGroupName.length < 2 ? <Descriptions bordered={has_border} column={Number(column)}>
        {visibleHeader.map(item => (
          <Descriptions.Item label={item.unit ? item.title + '（' + item.unit + '）' : item.title}
                             span={item.width === 0 ? 1 : item.width}>{<Cell value={firstContent[item.index]}
                                                                             header={item}
                                                                             row={firstContent}/>}</Descriptions.Item>))}
      </Descriptions> :
      <Fragment bordered={has_border} column={Number(column)}>{
        allGroupName.map(name => <div style={{marginBottom: '20px'}}>
          <Row> <Col flex="none">
            <div style={{
              textAlign: 'center',
              lineHeight: '45px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>{name !== 'null' ? name : '未分组'}</div>
          </Col> <Col flex="auto"><Divider></Divider></Col> </Row>
          <Descriptions bordered={has_border} column={Number(column)}>
            {data[name].map(item => (
              <Descriptions.Item label={item.unit ? item.title + '（' + item.unit + '）' : item.title}
                                 span={item.width === 0 ? 1 : item.width}>{<Cell value={firstContent[item.index]}
                                                                                 header={item}
                                                                                 row={firstContent}/>}</Descriptions.Item>))}
          </Descriptions>
        </div>)

      }</Fragment>
    return <Loading loading={loading}>
      <Row>
        {/*<Col style={{marginBottom: 20}} span={24}>*/}
        {/*  <TopButton spread={false}*/}
        {/*             value={firstContent}*/}
        {/*             onClick={(button) => {*/}
        {/*               open_edit ? this.submit((value) => {*/}
        {/*                 this.onButtonClick(button, {*/}
        {/*                   ...value,*/}
        {/*                   ...primary*/}
        {/*                 })*/}
        {/*               }) : this.onButtonClick(button, firstContent)*/}
        {/*             }}*/}
        {/*  />*/}
        {/*</Col>*/}
        <Col span={24}>
          {editStatus ? <EditBoard onClick={onClick}/> : <Board/>}
        </Col>
        {(editStatus && !open_edit) ? <Col span={24} style={{textAlign: 'center', marginTop: 50}}>
          <Button onClick={() => this.setState({editStatus: false})}>取 消</Button>
          <Button type="primary" style={{marginLeft: 8}}
                  onClick={() => this.submit((value) => this.onEditButton(value, primaryValue, onClick))}>保
            存</Button>
        </Col> : <Col span={24}>
          <InnerButton style={{marginTop: this.props.block?.getInnerButton().length > 0 ? 20 : 0}} value={firstContent}
                       onClick={(button) => {
                         open_edit ? this.submit((value) => {
                           this.onButtonClick(button, {
                             ...value,
                             ...primary,
                           })
                         }) : this.onButtonClick(button, firstContent)
                       }}
          /></Col>}
      </Row>
    </Loading>
  }
}
