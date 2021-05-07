import TreeCascade from '_elements/Input/component/TreeCascade';
import React from 'react';
import findChild from './findChild';

export default class RoleSelect extends React.Component {
  disabledList = [];

  componentDidMount() {
    const {header: {dict}, value, mode} = this.props;
    if (mode === 'edit') {
      const uuid = this.props?.row?.uuid ? this.props.row.uuid : null;
      this.disabledList = uuid ? [uuid] : [];
      if (value) {
        findChild(value, this.disabledList, dict);
      } else {
        findChild(uuid, this.disabledList, dict);
      }
    }
  }

  render() {
    const {onChange} = this.props;
    return <TreeCascade {...this.props} disabledList={this.disabledList} onChange={(v) => {
      onChange(v);
    }}/>;
  }
}
