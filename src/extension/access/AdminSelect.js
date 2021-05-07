import TreeCascade from '_elements/Input/component/TreeCascade';
import React from 'react';
import findChild from './findChild';

let first = false;
export default function (props) {
  const {header: {dict}, value, onChange, multiple = true} = props;
  if (!first) first = value;
  const disabledList = [];
  if (value && value instanceof Array) value.map(i => findChild(i, disabledList, dict));

  return <TreeCascade {...props} multiple disabledList={disabledList} onChange={(v) => {
    if (v && v instanceof Array) {
      v.map(i => findChild(i, disabledList, dict));
      onChange(v.filter(i => !disabledList.includes(i)));
    }
  }}/>;
}


