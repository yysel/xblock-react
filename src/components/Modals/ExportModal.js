import React from 'react';
import { Modal, Form, Input, Checkbox, Col, Row, Radio } from 'antd';
import moment from 'moment';

export default function(onOk, header, fileName, current) {
  let name = `${fileName}[${moment().format('YYYY-MM-DD')}]`;
  let headers = header.filter(i => i.exportable && i.visible).map(i => i.index);
  let page = 'all';
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  Modal.confirm({
    title: '文件导出配置',
    content:
      <Form  {...formItemLayout} >
        <Form.Item label="文件名">
          <Input onChange={(v) => name = v.target.value} defaultValue={name} suffix=".xslx"/>
        </Form.Item>
        <Form.Item label="选择导出列">
          <Checkbox.Group style={{ width: '100%' }}
                          onChange={(v) => headers = v}
                          defaultValue={headers}>
            <Row>
              {header.filter(i => i.exportable).map(i => <Col span={8}>
                <Checkbox value={i.index}>{i.title}</Checkbox>
              </Col>)}
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item label="导出范围">
          <Radio.Group defaultValue='all' onChange={(v) => page = v.target.value}>
            <Radio value="all">全部</Radio>
            <Radio value={current}>当前页</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>,
    onOk: () => onOk({ filename: name, header: headers, page }),
    okText: '确定',
    cancelText: '取消',
    width: 600,
  });
}
