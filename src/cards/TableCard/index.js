import React, {useState} from 'react'
import {Row, Col, Card, Tooltip, Popover, Checkbox} from 'antd'
import {SyncOutlined, SettingOutlined, RestOutlined, ArrowLeftOutlined} from '@ant-design/icons'
import {connect} from 'dva'

const CheckboxGroup = Checkbox.Group;
const TableCard = function (props) {

  const {
    title,
    hasSetting = false,
    recycled = false,
    loading = false,
    index,
    dispatch,
    blockSetting,
    header,
    onRecycle,
    onFullScreen,
    onSync,
    onBack,
    TopButton,
    ...rest
  } = props
  const options = header.filter(i => i.visible).map(i => ({label: i.title, value: i.index}))
  const color = recycled ? '#ff8684' : 'var(--primary-color)'
  // const color = recycled ? '#ff8684' : '#888888'
  const checkedList = blockSetting[index] ? blockSetting[index] : options.map(i => i.value);
  const setCheckedList = (value) => dispatch({
    type: '@@container/saveHeaderShow',
    value,
    index
  });

  const [checkAll, setCheckAll] = React.useState(checkedList.length === options.length);
  const [indeterminate, setIndeterminate] = React.useState(!!checkedList.length && checkedList.length < options.length);
  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = e => {
    const list = e.target.checked ? options.map(i => i.value) : [];
    setCheckedList(list);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const Extra = <div>

    <TopButton/>
    <span style={{fontSize: 20, color: 'var(--primary-color)',}}>
       {
         recycled ?
           <span style={{color: '#ff8684'}}>
            <Tooltip title={'返回'} placement="topLeft" onClick={onBack}>
              <ArrowLeftOutlined className='xblock-color-icon'/>
            </Tooltip>
          </span> :

           <span>
             {hasSetting && <span style={{marginLeft: 20}}>
            <Popover content={<Row style={{maxWidth: '120px'}}><CheckboxGroup options={options} value={checkedList}
                                                                              onChange={onChange}>
              <Row>
                {checkedList.map((i, k) => <Col span={24} flex={1} key={k}>
                  <Checkbox value={i}> {options.find(item => item.value === i)}</Checkbox>
                </Col>)}
              </Row>
            </CheckboxGroup></Row>}
                     title={<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                       显示设置
                     </Checkbox>} trigger="click" placement="bottom">
            {<Tooltip title={'显示设置'} placement="topLeft">
              <SettingOutlined className='xblock-color-icon'/>
            </Tooltip>}
           </Popover>
          </span>}
             {onRecycle && <span style={{marginLeft: 20}}>
                 <Tooltip key='RecycleIcon' title={'回收站'} placement="topLeft" onClick={onRecycle}>
                  <RestOutlined className='xblock-color-icon'/>
                </Tooltip>
            </span>}
             {onSync && <span style={{marginLeft: 20}}>
                  <Tooltip title={'刷新'} placement="topLeft" onClick={onSync}>
                    <SyncOutlined className='xblock-color-icon' spin={loading}/>
                  </Tooltip>
            </span>}

          </span>
       }
    </span>


  </div>

  const Title = <div style={{borderLeft: `3px solid ${color}`, color}}><span
    style={{marginLeft: 10, color: '#333'}}>{title}</span></div>
  return (
    <div style={{width: '100%'}}>
      <Card title={Title} extra={Extra}>
        {props.children}
      </Card>

    </div>

  )

}

export default connect(({'@@container': {blockSetting}}) => ({blockSetting}))((props) => <TableCard {...props} />)
