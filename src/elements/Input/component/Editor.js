import React from 'react';
import BraftEditor from 'braft-editor';
import {DatePicker} from "antd";

export default function Editor(props) {
  return <BraftEditor
    defaultValue={BraftEditor.createEditorState(props.value)}
    contentStyle={{
      height: props.height ? props.height : 600,
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'
    }}
    stripPastedStyles='true'
    media={{pasteImage: 'true'}}
    value={props.value instanceof String ? BraftEditor.createEditorState(props.value) : props.value}
    onChange={(v) => props.onChange(v.toHTML())}
    {...props?.header?.property}

  />
}

Editor.EditorShow = (props) => {
  const content = BraftEditor.createEditorState(props.value).toHTML();
  return (<div dangerouslySetInnerHTML={{__html: content}}/>);
};
