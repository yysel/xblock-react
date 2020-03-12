import React from 'react'
import Card from '../../cards/ColorHeaderCard'
import debounce from 'lodash/debounce'

export default function CommonCard (props) {
  const {block: {parameter, button, title, index, has_card, recyclable}, loading, inFullScreen, fullScreen, setInitParam} = props
  let isRecycle = false
  if (parameter && parameter.__deleted) isRecycle = true
  const newTitle = isRecycle ? title + ' - ' + '数据回收站' : title
  const formatTitle = DEV
    ? <a style={{color: isRecycle ? '#fff' : null}}>{newTitle + ' - ' + index}</a>
    : <span
      style={{color: '#333333'}}>{newTitle}
    </span>
  const recyleAble = recyclable && button.filter(bnt => bnt.index === 'delete').length
  const events = {
    onRecycle: recyleAble ? () => {
      setInitParam({__deleted: true})
      props.onChange({
        pagination: {},
        parameter: {__deleted: true},
        sorting: {},
      })
    } : null,
    onFullScreen: () => {
      inFullScreen(true)
    },
    onSync: debounce(() => {
      if (loading) return false
      props.onChange({}, true)
    }, 100),
    onBack: () => {
      setInitParam({__deleted: false})
      props.onChange({
        pagination: {},
        parameter: {__deleted: false},
        sorting: {},
      })
    }
  }
  return has_card && !fullScreen ? <Card title={formatTitle}
                                         recycled={isRecycle}
                                         loading={loading}
                                         {...events}
  >
    {props.children}
  </Card> : <div>{props.children}</div>

}
