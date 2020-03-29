import React, { PureComponent } from 'react'
import { getBlock } from '../../api'
import { Tree } from 'antd'
import { BarsOutlined, AppstoreOutlined, AuditOutlined, CaretDownOutlined } from '@ant-design/icons'

const {TreeNode} = Tree

export default class PermissionTree extends PureComponent {

  state = {
    treeData: [],
    expandedKeys: [],
    originParent: null,
    originValue: null,
  }

  getTreeData (id) {
    getBlock({block: this.props.index, action: 'permission_tree', payload: {id}}).then(({success, data}) => {
      if (success) this.setState({treeData: data})
    })
  }

  onCheck = (checked, {halfCheckedKeys: halfChecked}) => {
    this.props.onChange({checked, halfChecked})
  }

  renderTreeNodes = data =>
    data.map(item => {
      const iconStyle = {
        fontSize: 16, marginRight: 5, color: '#f5951f'
      }
      let Icon = <BarsOutlined style={iconStyle}/>

      if (item.type === 'block') {
        Icon = <AppstoreOutlined style={{...iconStyle, color: 'var(--primary-color)'}}/>
      }
      if (item.type === 'action') {
        Icon = <AuditOutlined style={{...iconStyle, color: '#009966'}}/>
      }
      let title = <span>
        {Icon}
        {item.text}
        </span>
      if (item?.children?.length) {
        return (
          <TreeNode title={title} selectable={false} key={item.value}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode key={item.value} selectable={false} title={title}/>
    })

  componentDidMount () {
    this.getTreeData(this.props.parentValue)
    this.state.originParent = this.props?.row?.parent_id
    this.state.originValue = this.props?.value
  }

  componentWillReceiveProps ({parentValue}) {
    const {parentValue: old, onChange, row = {}, mode} = this.props
    if (old !== parentValue && (old || parentValue)) {
      this.getTreeData(parentValue)
      if (mode === 'edit' && parentValue === row.parent_id) {
        onChange(row.permission)
      }
    }
  }

  render () {
    const {treeData, value} = this.state
    return <Tree
      checkedKeys={this.props.value}
      onCheck={this.onCheck}
      checkable
      switcherIcon={<CaretDownOutlined style={{fontSize: 18}}/>}
    >
      {
        this.renderTreeNodes(treeData)
      }
    </Tree>
  }

}
