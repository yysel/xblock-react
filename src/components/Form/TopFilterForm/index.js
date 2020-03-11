import React, { useState } from 'react'
import { Row, Col, Button, Form } from 'antd'

import { UpOutlined, DownOutlined } from '@ant-design/icons'

const FormItem = Form.Item

export default function TopFilterForm (props) {
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
    <Form form={form} onFinish={onSubmit}>
      <Row gutter={24}>
        {
          header.map((item, key) => {
            const dom = (
              <Col span={6} key={key}>

                <FormItem name={item.index}
                          label={item.title}
                          labelAlign='left'
                          labelCol={{flex: `${(item.title.length + 1) * 14}px`}}
                          wrapperCol={{flex: 'auto'}}
                          initialValue={parameter ? parameter[item.index] : null}
                >
                  <Input header={item} mode={'filter'}/>
                </FormItem>
              </Col>
            )
            if (key > 3) return expand ? dom : null
            return dom
          })
        }
      </Row>
      <Row>
        <Col span={24} style={{textAlign: 'right'}}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            style={{marginLeft: 8}}
            onClick={() => {
              form.resetFields()
            }}
          >
            重置
          </Button>
          {
            header.length > 4 && <a
              style={{marginLeft: 8, fontSize: 14}}
              onClick={() => {
                onChange({})
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


