import React, { PureComponent } from 'react'
import NoticeIcon from './NoticeIcon'
import { connect } from 'dva'
import moment from 'moment'
import { Tag } from 'antd'
import groupBy from 'lodash/groupBy'
import getAction from '../../action'

@connect(({'@@xblock': {currentUser, notices}, loading}) => ({
  currentUser: currentUser,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices,
}))
export default class Notice extends PureComponent {

  constructor (props) {
    super(props)
    const {clearNotices, fetchNotices} = getAction(this.props.dispatch)
    this.clearNotices = clearNotices
    this.fetchNotices = fetchNotices
  }

  componentWillMount () {
    this.fetchNotices()
  }

  onNoticeVisibleChange = visible => {
    if (visible) this.fetchNotices()
  }

  onNoticeClear = type => {
    this.clearNotices({payload: {type}})
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

  render () {
    const {
      fetchingNotices,
      dispatch,
      notices = [],
    } = this.props
    const noticeData = this.getNoticeData()
    return <NoticeIcon
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
      onClear={this.onNoticeClear}
      onPopupVisibleChange={this.onNoticeVisibleChange}
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
  }
}