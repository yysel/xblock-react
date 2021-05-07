import React, {Fragment} from 'react'
import {Table, Row, Col} from 'antd'
import {Alert} from 'antd'

export default function (props) {
  const {
    data: {list, pagination},
    loading,
    columns,
    rowKey,
    rowClassName,
    onChange,
    selectBar,
    onSelectRow,
    selectedRows,
    ...rest
  } = props
  const paginationProps = pagination ? {
    showSizeChanger: true,
    showQuickJumper: true,
    ...pagination,
  } : false

  const rowSelection = selectBar ? {
    selectedRowKeys: selectedRows,
    onChange: onSelectRow,
    getCheckboxProps: record => ({
      disabled: record.disabled,
    }),
  } : null

  return (
    <div className='xblock-standard-table'>
      <div className='tableAlert'>
        {selectBar && selectedRows.length ? <Alert
          message={
            <Row justify='space-between'>
              <Col>
                已选择 <a style={{fontWeight: 600}}>{selectedRows.length}</a> 项&nbsp;&nbsp;
              </Col>
              <Col>
                <a onClick={() => {
                  onSelectRow([])
                }} style={{marginLeft: 24}}>
                  取消选择
                </a>
              </Col>

            </Row>
          }
          type="info"
          showIcon
        /> : null}
      </div>
      <Table
        {...rest}
        loading={loading}
        rowKey={rowKey || 'key'}
        rowSelection={rowSelection}
        dataSource={list}
        columns={columns}
        pagination={paginationProps}
        onChange={onChange}
        rowClassName={rowClassName}

      />
    </div>
  )
}
