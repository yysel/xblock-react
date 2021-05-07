import React, {PureComponent} from 'react'
import {Menu, Spin, Dropdown, Avatar, Divider} from 'antd'
import {UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined} from '@ant-design/icons'
import Debounce from 'lodash-decorators/debounce'
import {Link} from 'dva/router'
import {connect} from 'dva'
import * as routerRedux from 'react-router-redux'
import getAction from '../../action'

@connect(({'@@xblock': {currentUser, collapsed}, '@@app': {webSocketStatus, logo}}) => ({
  currentUser: currentUser,
  webSocketStatus,
  logo,
  collapsed
}))

export default class GlobalHeader extends PureComponent {
  state = {
    srcPic: '',
  }


  constructor(props) {
    super(props)
    const {changeLayoutCollapsed, clearMenu, logoutGoHome} = getAction(this.props.dispatch)
    this.changeLayoutCollapsed = changeLayoutCollapsed
    this.clearMenu = clearMenu
    this.logoutGoHome = logoutGoHome
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel()
  }

  onMenuClick = ({key}) => {

    if (key === 'personage') {
      this.props.dispatch(routerRedux.push('/user/info'))
      return
    }
    if (key === 'logout') {
      this.logoutGoHome({
        home: this.props.baseRedirect,
      }).then(() => this.clearMenu({
        payload: [],
      }))
    }
  }

  handleMenuCollapse = collapsed => {
    this.changeLayoutCollapsed({
      payload: collapsed,
    })
  }

  toggle = () => {
    const {collapsed} = this.props
    this.handleMenuCollapse(!collapsed)
    this.triggerResizeEvent()
  }

  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, false)
    window.dispatchEvent(event)
  }

  render() {
    const {
      collapsed,
      isMobile,
      logo,
    } = this.props
    const currentUser = this.props.currentUser ? this.props.currentUser : {}
    const menu = (
      <Menu className={'xblock-global-header-menu'} selectedKeys={[]} onClick={this.onMenuClick}>
        {/*<Menu.Item key="personage" disabled >*/}
        {/*  <UserOutlined/>*/}
        {/*  个人中心*/}
        {/*</Menu.Item>*/}

        {/*<Menu.Divider/>*/}

        <Menu.Item key="logout" >
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    )
    return (
      <div className='xblock-global-header-top'>
        {isMobile && [
          <Link to="/" className='xblock-global-header-logo' key="logo">
            <img src={logo} alt="logo" width="32"/>
          </Link>,
          <Divider type="vertical" key="line"/>,
        ]}
        {collapsed ? <MenuUnfoldOutlined className='xblock-global-header-trigger' onClick={this.toggle} style={{lineHeight:'64px'}}/> :
          <MenuFoldOutlined className='xblock-global-header-trigger' onClick={this.toggle} style={{lineHeight:'64px'}}/>}
        <div className='xblock-global-header-right'>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className='action account'>
              {/*<Avatar size="small" className={styles.avatar} src={currentUser.avatar} />*/}
                <Avatar className='avatar'
                        style={{borderColor: this.props.webSocketStatus ? '#26AE96' : '#CCC'}}
                        src={currentUser.avatar ? currentUser.avatar : this.state.srcPic}/>
              <span className='name'>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{marginLeft: 8}}/>
          )}
        </div>
      </div>
    )
  }
}
