import React, {useState} from 'react'
import {Row, Col, Button, Form} from 'antd'

import {UpOutlined, DownOutlined} from '@ant-design/icons'

const FormItem = Form.Item

export default function TopFilterForm(props) {
  const {header = [], parameter = {}, Input, onChange} = props
  if (header.length <= 0) return null
  const onSubmit = (value) => {
    const {onChange} = props
    const filter = Object.keys(value).filter(k => value[k])
    if (filter.length) {
      onChange({parameter: value})
    }

  }
  const [expand, setExpand] = useState(false)
  const [form] = Form.useForm()
  return (
    <Form form={form} initialValues={parameter} onFinish={onSubmit}>
      <Row gutter={24} justify='space-between'>
        {
          header.map((item, key) => {
            const dom = (
              <Col span={6} key={key}>

                <FormItem style={{display: 'flex', flexFlow: 'row nowrap', margin: '0 0 20px 0'}} name={item.index}
                          label={item.title}
                          labelAlign='left'
                          labelCol={{flex: `${(item.title.length + 1) * 14}px`}}
                          wrapperCol={{flex: 'auto'}}
                >
                  <Input header={item} mode={'filter'}/>
                </FormItem>
              </Col>
            )
            if (key > 2) return expand ? dom : null
            return dom
          })
        }
        {(header.length && header.length % 4 === 0 && expand) && <Col span={6}></Col>}
        {((header.length && header.length % 4 === 2 && expand) || (header.length === 2)) && <Col span={6}></Col>}
        <Col span={6} style={{textAlign: 'right', marginBottom: 20}}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{marginLeft: 8}}
            onClick={() => {
              onChange({}).then(()=>form.resetFields())

            }}
          >
            重置
          </Button>
          {
            header.length > 3 && <a
              style={{marginLeft: 8, fontSize: 14}}
              onClick={() => {
                setExpand(!expand)
              }}
            >
              {expand ? <span> <UpOutlined/> 收起</span> : <span> <DownOutlined/> 展开</span>}
            </a>
          }

        </Col>
      </Row>
    </Form>
  )
}


