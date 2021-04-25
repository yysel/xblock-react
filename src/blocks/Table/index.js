import React, { PureComponent } from 'react'
import StandardTable from './BaseTable'
import { routerRedux } from 'dva/router'
import { parseString } from '../../tools/helper'

export default class CommonTable extends PureComponent {
  state = {
    selectedRows: [],
    selectedRowsValue: [],
  }

  onChange = (pagination, filtersArg, sorter) => {
    const {block: {parameter = {}, sorting: oldSorting}, onChange} = this.props
    let sorting = oldSorting
    if (Object.keys(sorter).length !== 0) {
      if (sorter.order === 'false') delete sorting[sorter.field]
      else sorting[sorter.field] = sorter.order.replace('end', '')
    }
    onChange({
      pagination: {
        size: pagination.pageSize,
        page: pagination.current,
      },
      parameter: {...parameter, ...filtersArg},
      sorting,
    })
  }

  handleSelectRows = (rows, rowValue) => {
    this.setState({selectedRows: rows, selectedRowsValue: rowValue})
  }

  onTopButtonClick = (button) => {
    const {selectedRowsValue, selectedRows} = this.state
    const {changeAddFormVisible, changeCommonFormVisible, onClick} = this.props
    if (button.form) return changeCommonFormVisible(true, button)
    if (button.index === 'add') return changeAddFormVisible(true)
    onClick(button.index, {value: selectedRows, button, selectedRows: selectedRowsValue})
  }

  onInnerButtonClick (button, value) {
    const {onClick, changeEditFormVisible} = this.props
    if (button.index === 'edit') return changeEditFormVisible(true, value)
    onClick(button.index, {button, value})
  };

  getInnerButton (sizeRadio, fixed) {
    const {block: {button = [], property: {button_show_key = 'button_status'}}, InnerButton} = this.props
    const buttonInner = button ? button.filter(item => item.position === 'inner') : []
    if (buttonInner.length <= 0) return null
    return {
      title: '操作',
      fixed: fixed ? 'right' : false,
      width: (buttonInner.length * 75 + 70) * sizeRadio,
      align: 'center',
      render: (value) => <InnerButton onClick={(button) => this.onInnerButtonClick(button, value)}
                                      value={value}
                                      buttonStatue={value[button_show_key] && value[button_show_key] instanceof Object ? value[button_show_key] : {}}/>

    }
  }

  getColumn = () => {
    const {block: {header = [], sorting}, Cell} = this.props
    return header.filter(item => item.visible).map(item => {
      let {
        title,
        index: dataIndex,
        input: filterType,
        sortable,
        filterable,
        unit,
        fixed,
        width,
      } = item
      const newTitle = unit ? title + '（' + unit + '）' : title
      let column = {
        key: dataIndex,
        title: newTitle,
        dataIndex,
      }
      if (sortable) {
        const order = sorting?.[dataIndex] ? sorting[dataIndex] + 'end' : false
        column.sorter = true
        column.sortOrder = order
        column.sortDirections = ['ascend', 'descend', 'false']
      }
      if (fixed) column.filterType = 'left'
      if (width !== 0) column.width = width
      if (filterable) {
        column.filterType = filterType
      }
      column.render = (value, row) => <Cell value={value} header={item} row={row}/>
      return column
    })
  }

  render () {
    const {
      loading,
      dispatch,
      block: {content, pagination, button, primary_key, property: {has_border, link}},
      onRow,
      rowClassName,
      TopButton,
      ...rest
    } = this.props
    const {selectedRows} = this.state
    const column = this.getColumn()
    let size = 'default'
    let sizeRadio = 1
    const wind = window.screen.width
    if (wind > 1700) {
      size = 'default'
      sizeRadio = 1
    } else if (wind <= 1700 && wind > 1400) {
      size = 'middle'
      sizeRadio = 0.85
    } else {
      sizeRadio = 0.7
      size = 'small'
    }
    const innerButton = this.getInnerButton(sizeRadio, column.length > 14)
    if (innerButton) column.push(innerButton)
    const data = {
      list: content,
      pagination: pagination ? {
        pageSize: pagination?.size ? pagination.size : 10,
        current: pagination?.page ? pagination.page : 1,
        total: pagination?.total ? pagination.total : 0,
        showQuickJumper: false,
        showTotal: (total) => `共计 ${total} 条`,
      } : false,
    }
    return (<div>
      <div className='xblock-table-tableList'>
        <div style={{marginBottom: 10}}>
          <TopButton spread={false} onClick={(button) => this.onTopButtonClick(button)}/>
        </div>
        <StandardTable
          bordered={has_border}
          selectedRows={selectedRows}
          loading={loading}
          scroll={column.length <= 15 ? null : {x: '100vw'}}
          data={data}
          columns={column}
          selectBar={button.filter(bnt => bnt.mode).length}
          rowClassName={link ? 'tableClickAble' : rowClassName}
          size={size}
          {...rest}
          onSelectRow={this.handleSelectRows.bind(this)}
          onChange={this.onChange}
          rowKey={primary_key}
          onRow={(record) => {
            let event = onRow ? onRow(record) : {}
            if (link) event = {
              onClick: () => {
                dispatch(routerRedux.push({
                  pathname: parseString(link, record),
                  value: record,
                }))
              },
              ...event,
            }
            return event
          }}
        />
      </div>
    </div>)
  }
}
