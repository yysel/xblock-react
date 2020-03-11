import React from 'react'
import { Row, Col, Card as AntCard } from 'antd'

export default function (props) {

  const {Icon, radius, color, titleStyle, title, Icons = []} = props
  return (
    <Row style={{width: '100%'}}>
      <Col span={24}>
        <div className='color-header-card-head' style={{
          borderRadius: radius,
          backgroundColor: color,
          display: title ? 'block' : 'none',
          width: '100%'
        }}>
          <span style={titleStyle}>{props.title}</span>
          {Icon && <Icon/>}
          {Icons.length > 0 && Icons.map(item => {
            const Item = item
            return <Item/>
          })}
        </div>
      </Col>
      <Col span={24}>
        <AntCard style={{marginBottom: '25px', padding: 10}} {...props}
                 title={null}>{props.children}</AntCard>
      </Col>
    </Row>
  )

}
