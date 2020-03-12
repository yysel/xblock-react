import React from 'react'
import { Row, Col, Card, Tooltip } from 'antd'
import { SyncOutlined, FullscreenOutlined, RestOutlined, ArrowLeftOutlined } from '@ant-design/icons'

export default function (props) {

  const {title, recycled = false, loading = false, onRecycle, onFullScreen, onSync, onBack} = props
  const style = recycled ? {
    color: '#ffffff',
    backgroundColor: '#ff8684'
  } : {}
  return (
    <div style={{width: '100%'}}>
      <Row className='xblock-color-header-card-head' style={style}>
        <Col className='color-header-card-head-left' flex='200px'></Col>
        <Col flex='auto'>{title}</Col>
        {
          recycled ?
            <Col className='color-header-card-head-right' flex='200px'>
              <Tooltip  title={'返回'} placement="bottomLeft" onClick={onBack}>
                <ArrowLeftOutlined className='xblock-color-icon'/>
              </Tooltip>
            </Col> :
            <Col className='color-header-card-head-right' flex='200px'>
              {onFullScreen &&<Tooltip  title={'全屏显示'} placement="bottomLeft" onClick={onFullScreen}>
                <FullscreenOutlined className='xblock-color-icon'/>
              </Tooltip>}
              {onRecycle && <Tooltip key='RecycleIcon' title={'回收站'} placement="bottomLeft" onClick={onRecycle}>
                <RestOutlined className='xblock-color-icon'/>
              </Tooltip>}
              {onSync &&<Tooltip  title={'刷新'} placement="bottomLeft" onClick={onSync}>
                <SyncOutlined className='xblock-color-icon' spin={loading}/>
              </Tooltip>}
            </Col>
        }

      </Row>
      <Row className='xblock-color-header-card-content'>
        <Card style={{marginBottom: '25px', padding: 10, width: '100%'}} {...props}
              title={null}>{props.children}</Card>
      </Row>
    </div>

  )

}
