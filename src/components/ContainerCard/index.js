import React, { PureComponent } from 'react'
import Card from '../Card'
import { Tooltip, Modal } from 'antd'
import { checkCode } from '../../tools/response'
import styles from '../../styles/component.less'
import debounce from 'lodash/debounce'
import {Icon} from '@ant-design/compatible'

const confirm = Modal.confirm
export default function CommonCard (props) {
  const {block: {parameter, button, title, index, has_card,}, spin, sync, recycle, sequence, lastKey, menu, inFullScreen, fullScreen, setInitParam} = props
  let isRecycle = false
  if (parameter && parameter.__deleted) isRecycle = true
  const newTitle = isRecycle ? title + ' - ' + '数据回收站' : title
  const formatTitle = DEV ? <a href={`#/page/header-prop/${index}`}
                               style={{color: isRecycle ? '#fff' : null}}>{newTitle + ' - ' + index}</a> : <span
    style={{color: '#333333'}}>{newTitle}</span>
  const onChange = debounce(function () {
    if (spin) return false
    props.onChange({}, true)
  }, 100)

  const SyncIcon = () => sync ?
    <Tooltip key='SyncIcon' title={'刷新'} placement="bottomLeft" autoAdjustOverflow={false}> <Icon
      spin={spin} className={isRecycle ? styles.tooltipWhite : styles.tooltipPrimary}
      type="sync"
      onClick={onChange}/>
    </Tooltip> : null
  const FullIcon = () => sync ?
    <Tooltip key='FullIcon' title={'全屏展示'} placement="bottomLeft" autoAdjustOverflow={false}> <Icon
      type="fullscreen"
      className={isRecycle ? styles.tooltipWhite : styles.tooltipPrimary}
      onClick={() => inFullScreen(true)}/>
    </Tooltip> : null
  const RecycleIcon = () => recycle && button.filter(bnt => bnt.index === 'delete').length ?
    <Tooltip key='RecycleIcon' title={'回收站'} placement="bottomLeft"> <Icon
      type="rest"
      className={isRecycle ? styles.tooltipWhite : styles.tooltipPrimary}
      onClick={() => {
        setInitParam({__deleted: true})
        props.onChange({
          pagination: {},
          parameter: {__deleted: true},
          sorting: {},
        })
      }}/></Tooltip> : null
  const BackIcon = () => isRecycle ?
    <Tooltip key='BackIcon' title={'返回'} placement="bottomLeft" autoAdjustOverflow={false}> <Icon
      style={{color: '#fff'}}
      type="arrow-left"
      className={isRecycle ? styles.tooltipWhite : styles.tooltipPrimary}
      onClick={() => {
        setInitParam({__deleted: false})
        props.onChange({
          pagination: {},
          parameter: {__deleted: false},
          sorting: {},
        })
      }}/></Tooltip> : null
  const CloseIcon = DEV ? () => <div key='CloseIcon' className={isRecycle ? styles.closeWhite : styles.closePrimary}>
    <Tooltip title={'移除模块'} placement="bottomLeft">
      <Icon
        type={'close'} style={{marginLeft: '30px'}} onClick={() => {
        confirm({
          title: '移除模块?',
          content: '该操作将从本页面中移除选中的模块（可以从菜单管理中恢复），是否确认？',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            getBlock('system_menu_list', 'delete_block', {
              'menu_uuid': menu.uuid,
              'block_index': index,
            }).then((data) => {
              if (data.code < 1000) window.location.reload()
              else checkCode(data)
            })
          },
        })
      }}/>
    </Tooltip>

    {
      (lastKey !== 0 && sequence !== lastKey) &&
      <Tooltip title={'向下移动'}
               placement="bottomLeft">
        <Icon type={'arrow-down'}
              style={{marginLeft: '20px'}}
              onClick={() => {
                getBlock('system_menu_list', 'update_sequence', {
                  'menu_uuid': menu.uuid,
                  'block_index': index,
                  'type': 'down',
                }).then((data) => {
                  if (data.code < 1000) window.location.reload()
                  else checkCode(data)
                })
              }}/>
      </Tooltip>
    }

    {
      (lastKey !== 0 && sequence !== 0) &&
      <Tooltip title={'向上移动'}
               placement="bottomLeft">
        <Icon type={'arrow-up'}
              style={{marginLeft: '20px'}}
              onClick={() => {
                getBlock('system_menu_list', 'update_sequence', {
                  'menu_uuid': menu.uuid,
                  'block_index': index,
                  'type': 'up',
                }).then((data) => {
                  if (data.code < 1000) window.location.reload()
                  else checkCode(data)
                })
              }}/>
      </Tooltip>
    }
  </div> : null
  return has_card && !fullScreen ? <Card title={formatTitle}
                                         titleStyle={{color: isRecycle ? '#FFF' : '#131313'}}
                                         color={isRecycle ? '#ff8684' : ''}
                                         Icon={CloseIcon}
                                         Icons={isRecycle ? [BackIcon] : [SyncIcon, RecycleIcon, FullIcon]}
  >
    {props.children}
  </Card> : <div>{props.children}</div>

}
