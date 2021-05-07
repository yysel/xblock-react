import React from 'react';
import {TreeSelect} from 'antd';
import {getDictTree} from '_tools/helper';

export default function (props) {
  const {value, header: {dict}, onChange, multiple = false, checkAble = false, disabledList = []} = props;
  return (
    <TreeSelect
      style={{width: '100%'}}
      multiple={multiple}
      treeCheckable={checkAble}
      allowClear
      showSearch
      value={value}
      treeNodeFilterProp="title"
      dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
      treeData={getDictTree(dict, null, disabledList)}
      placeholder="请选择"
      onChange={onChange}
    />
  );
}

