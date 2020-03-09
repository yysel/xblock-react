import React, { PureComponent, Fragment } from 'react'
import Query from './Query';
import { BackTop, Row } from 'antd'


export default class BasicContainer extends PureComponent {

  render () {
    const {block, ...rest} = this.props
    return <Fragment>
      <Row gutter={16}>
        {block.map((item, sequence) => <Query key={item} sequence={sequence} index={item} {...rest} />)}
      </Row>
      <BackTop>
        <div className="ant-back-top-inner">UP</div>
      </BackTop>
    </Fragment>
  }
}
