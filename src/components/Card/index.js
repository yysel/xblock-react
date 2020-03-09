// import React from 'react';
import React, { PureComponent } from 'react'
import { Row, Col, Card as AntCard } from 'antd'
import styles from '../../styles/component.less'

export default function (props) {

  const {Icon, radius, color, titleStyle, title, Icons = []} = props
  return (
    <div>
      <Row>
        <div className={styles.cardHead} style={{
          borderRadius: radius,
          backgroundColor: color,
          display: title ? 'block' : 'none',
        }}>
          <span style={titleStyle}>{props.title}</span>
          {Icon && <Icon/>}
          {Icons.length > 0 && Icons.map(item => {
            const Item = item
            return <Item/>
          })}
        </div>
      </Row>
      <Row>
        <AntCard style={{marginBottom: '25px', padding: 10}} {...props}
                 title={null}>{props.children}</AntCard>
      </Row>
    </div>
  )

}
