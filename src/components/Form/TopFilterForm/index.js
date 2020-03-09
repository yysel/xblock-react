import React, { PureComponent } from 'react'
import { Row, Col, Button } from 'antd'
import styles from '../../../styles/form.less'
import { Field } from '../../../elements'
import { Form ,Icon} from '@ant-design/compatible'

const FormItem = Form.Item

class TopFilterForm extends PureComponent {

  state = {
    expandForm: false,
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    })
  }

  handleFormReset = () => {
    const {form, onChange} = this.props
    onChange({})
    form.resetFields()
  }

  onSubmit () {
    const {form, onChange} = this.props
    form.validateFields((err, value) => {
      if (err) return
      const filter = Object.keys(value).filter(k => value[k])
      if (filter.length) {
        onChange({parameter: value})
      }
    })
  }

  render () {
    const {form: {getFieldDecorator}, header = [], parameter = {}, style = {}, index, blockConfig} = this.props
    const {expandForm} = this.state
    return header.length > 0 ? (
      <Form layout="inline" className={styles.tableListForm}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col xs={24} sm={15} md={17} lg={16} xl={18} xxl={20}>
            <Row gutter={{md: 8, lg: 24, xl: 48}}>
              {
                header.map((item, key) => {
                  const dom = (<Col xl={6} lg={6} md={12} sm={24}>
                    <FormItem
                      label={<span style={{color: style.fontColor ? style.fontColor : '#000'}}>{item.title}</span>}>
                      {
                        getFieldDecorator(item.index, {
                          initialValue: parameter ? parameter[item.index] : null,
                        })(<Field header={item} mode={'filter'} index={index}
                                  extension={blockConfig?.header ? blockConfig.header : {}}/>)
                      }
                    </FormItem>
                  </Col>)
                  if (key > 3) return expandForm ? dom : null
                  return dom
                })
              }
            </Row>
          </Col>

          <Col xs={24} sm={9} md={7} lg={8} xl={6} xxl={4}>
            <span className={styles.submitButtons}>
              {
                header.length > 4 && (expandForm
                  ? (<a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>收起 <Icon type="up"
                                                                                              style={{marginRight: 20}}/>
                  </ a>)
                  : (<a style={{marginLeft: 8}} onClick={this.toggleForm.bind(this)}>展开 <Icon type="down"
                                                                                              style={{marginRight: 20}}/></ a>))
              }
              <Button type="primary" onClick={this.onSubmit.bind(this)}>查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset.bind(this)}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    ) : null
  }
}

export default Form.create()(TopFilterForm)
