import React from 'react';
import { Switch } from 'antd';

import Upload from './component/Upload';
import Editor from './component/Editor';
import Select from './component/Select';
import SelectMulti from './component/SelectMulti';
import CheckBox from './component/CheckBox';
import Radio from './component/Radio';
import Text from './component/Text';
import TextArea from './component/TextArea';
import TreeCascade from './component/TreeCascade';
import Date from './component/Date';
import Month from './component/Month';
import Password from './component/Password';

export default [
  {
    title: '文本',
    key: 'text',
    component: Text,
  },
  {
    title: '密码',
    key: 'password',
    component: Password,
  },
  {
    title: '文本域',
    key: 'textarea',
    component: TextArea,
  },
  {
    title: '富文本编辑器',
    key: 'editor',
    component: (props) => <Editor {...props} type='html'/>,
  },
  {
    title: '下拉单选',
    key: 'select',
    component: (props) => <Select custom={false} {...props}/>,
  },
  {
    title: '单选',
    key: 'radio',
    component: Radio,
  },
  {
    title: '多选',
    key: 'checkbox',
    component: CheckBox,
  },
  {
    title: '下拉单选',
    key: 'select_multi',
    component: SelectMulti,
  },
  {
    title: '级联单选',
    key: 'cascade',
    component: TreeCascade,
  },
  {
    title: '级联多选',
    key: 'cascade_multi',
    component: (props) => <TreeCascade {...props} multiple checkAble/>,
  },
  {
    title: '全节点级联多选',
    key: 'cascade_checkbox',
    component: (props) => <TreeCascade {...props} multiple/>,
  },
  {
    title: '开关',
    key: 'switch',
    component: ({ header = {}, value, onChange, ...rest }) => {
      return <Switch style={{ marginLeft: 5 }} checked={Number(value)} onChange={v => onChange(Number(v))} {...rest}/>;
    },
  },
  {
    title: '日期',
    key: 'date',
    component: Date,
  },
  {
    title: '月份选择器',
    key: 'month',
    component: Month,
  },
  {
    title: '单文件上传',
    key: 'upload',
    component: Upload,
  },

];
