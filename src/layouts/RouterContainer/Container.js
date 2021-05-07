import React, {PureComponent, Fragment} from 'react'
import Query from './Query';
import {BackTop, Row, Tabs} from 'antd'

const {TabPane} = Tabs;
export default class BasicContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state.key = this.props.block?.[0]
  }

  state = {
    key: '',
    title: {}
  }


  render() {
    const {block, display, ...rest} = this.props
    const TabBlock = <Fragment>
      <div style={{backgroundColor: '#ffffff', padding: '0 20px'}}>

        <Tabs onChange={(v) => this.setState({key: v})} size={"large"} defaultActiveKey={block?.[0]}
              tabBarStyle={{margin: 0}}>
          {block.map((item) => <TabPane tab={this.state.title?.[item] ? this.state.title?.[item] : '加载中...'}
                                        key={item}/>)}
          <BackTop>
            <div className="ant-back-top-inner">UP</div>
          </BackTop>
        </Tabs>
      </div>
      <div style={{margin: "20px"}}>
        {block.map((item, sequence) => <div key={item} style={{display: this.state.key === item ? 'block' : 'none'}}>
          <Query key={item} sequence={sequence} index={item} {...rest} setTitle={(v) => {
            const obj = {}
            obj[item] = v
            this.setState({title: {...this.state.title, ...obj}})
          }}/></div>)}
      </div>
    </Fragment>
    const Block = <div style={{margin: "20px 20px 0"}}>
      <Row gutter={16}>
        {block.map((item, sequence) => <Query key={item} sequence={sequence} index={item} {...rest} />)}
      </Row>
      <BackTop>
        <div className="ant-back-top-inner">UP</div>
      </BackTop>
    </div>
    return display === 'tile' ? Block : TabBlock;
  }
}
