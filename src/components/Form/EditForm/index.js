import React from 'react';
import { Button, Drawer } from 'antd';
import { Field, FormRule } from '../../../elements';
import { isUndefined } from '../../../tools/type';
import { connect } from 'dva';

import { Form } from '@ant-design/compatible'
const EditForm = Form.create()(function(props) {
  const { form, editFormVisible, header, changeEditFormVisible, value, onOk, index, blockConfig } = props;

  function okHandle(uuid) {
    form.validateFields((err, value) => {
      if (err) return;
      const filter = Object.keys(value).map(k => {
        if (isUndefined(value[k])) {
          value[k] = null;
        }
      });
      if (filter.length) {
        onOk({ ...value, uuid }).then(({ success }) => {
          if (success) {
            changeEditFormVisible(false);
            form.resetFields();
          }
        });
      }
    });
  }

  return (
    <Drawer
      title={'编辑面板'}
      visible={editFormVisible[index]}
      onClose={() => changeEditFormVisible(false)}
      placement='right'
      width={500}
      getContainer={false}
    >
      {editFormVisible[index] && <Form>
        {header.map(function(column) {
          const rules = [{
            required: column.require, message: column.message ? column.message : `请填写${column.title}`,
          }];
          if (column.value_type !== 'normal') rules.push({
            type: column.value_type,
            message: `必须是${column.value_type}类型`,
          });
          return (<Form.Item key={column.index} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={column.title}>
            {form.getFieldDecorator(column.index, {
              initialValue: value ? value[column.index] : null,
              rules: FormRule(column),
            })(<Field header={column} row={value} mode={'edit'} index={index}
                      extension={blockConfig?.header ? blockConfig.header : {}}/>)}
          </Form.Item>);
        })}
      </Form>}

      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={() => changeEditFormVisible(false)}>
          取消
        </Button>
        <Button type="primary" style={{ marginLeft: 20 }} htmlType="submit"
                onClick={() => okHandle(value.uuid)}>
          保存
        </Button>
      </div>
    </Drawer>
  );
});

export default connect(({ "@@container": { editFormVisible, editFormValue } }) => ({
  editFormVisible,
  value: editFormValue,
}))(EditForm);

