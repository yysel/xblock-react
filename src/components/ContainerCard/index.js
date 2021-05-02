import React from 'react'
import Card from '../../cards/TableCard'
import debounce from 'lodash/debounce'

export default function CommonCard(props) {
  const {block: {parameter, component, button, title, index, has_card, recyclable, header}, TopButton, loading, inFullScreen, fullScreen, setInitParam} = props
  let isRecycle = false
  if (parameter && parameter.__deleted) isRecycle = true
  const newTitle = isRecycle ? title + ' - ' + '数据回收站' : title
  const formatTitle = DEV ? newTitle + ' - ' + index : {newTitle}
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
                                         index={index}
                                         hasSetting={component === 'table'}
                                         header={header}
                                         recycled={isRecycle}
                                         loading={loading}
                                         TopButton={TopButton}
                                         {...events}
  >
    {props.children}
  </Card> : <div>{props.children}</div>

}
