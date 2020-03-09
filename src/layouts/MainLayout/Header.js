import React, { PureComponent } from 'react'
import { Menu, Spin, Tag, Dropdown, Avatar, Divider } from 'antd'
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import Debounce from 'lodash-decorators/debounce'
import { Link } from 'dva/router'
import NoticeIcon from './NoticeIcon'
import { connect } from 'dva'
import { changeLayoutCollapsed } from '../../action'

@connect(({'@@app': {webSocketStatus, logo}, '@@xblock': {collapsed}}) => ({
  webSocketStatus, logo, collapsed
}))
export default class Header extends PureComponent {
  state = {
    srcPic: 'http://localhost:8000/user.svg',
  }

  componentWillUnmount () {
    this.triggerResizeEvent.cancel()
  }

  handleMenuCollapse = collapsed => {
    changeLayoutCollapsed({
      payload: collapsed,
    })
  }

  getNoticeData () {
    const {notices = []} = this.props
    if (notices.length === 0) {
      return {}
    }
    const newNotices = notices.map(notice => {
      const newNotice = {...notice}
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow()
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status]
        newNotice.extra = (
          <Tag color={color} style={{marginRight: 0}}>
            {newNotice.extra}
          </Tag>
        )
      }
      return newNotice
    })
    return groupBy(newNotices, 'type')
  }

  toggle = () => {
    const {collapsed} = this.props
    this.handleMenuCollapse(!collapsed)
    this.triggerResizeEvent()
  }

  @Debounce(600)
  triggerResizeEvent () {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, false)
    window.dispatchEvent(event)
  }

  render () {
    const {
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      dispatch,
      onNoticeClear,
      notices = [],
    } = this.props
    const currentUser = this.props.currentUser ? this.props.currentUser : {}
    const menu = (
      <Menu className={'xblock-global-header-menu'} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="personage">
          <UserOutlined/>
          个人中心
        </Menu.Item>

        <Menu.Divider/>

        <Menu.Item key="logout">
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    )
    const noticeData = this.getNoticeData()
    return (
      <div className='xblock-global-header-top'>
        {isMobile && [
          <Link to="/" className='xblock-global-header-logo' key="logo">
            <img src={logo} alt="logo" width="32"/>
          </Link>,
          <Divider type="vertical" key="line"/>,
        ]}
        {collapsed ? <MenuUnfoldOutlined className='xblock-global-header-trigger' onClick={this.toggle}/> :
          <MenuFoldOutlined className='xblock-global-header-trigger' onClick={this.toggle}/>}
        <div className='xblock-global-header-right'>
          <NoticeIcon
            className='action'
            count={notices.length}
            onItemClick={(item) => {
              dispatch({
                type: 'global/clearNotices',
                payload: {uuid: item.uuid},
              })
              if (item?.data?.path) {
                if (item?.data?.['module']) crossGoPage(item.data['module'], item.data.path)
                else goPage(item.data.path, {}, false, false, {reload: true})
              }
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            loading={fetchingNotices}
            popupAlign={{offset: [20, -16]}}
          >
            <NoticeIcon.Tab
              list={noticeData['notice']}
              type={'notice'}
              title="通知"
              emptyText="你已查看所有通知"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
            />
            <NoticeIcon.Tab
              type={'message'}
              list={noticeData['message']}
              title="消息"
              emptyText="您已读完所有消息"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            />
            <NoticeIcon.Tab
              type={'todo'}
              list={noticeData['todo']}
              title="待办"
              emptyText="你已完成所有待办"
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
            />
          </NoticeIcon>
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
