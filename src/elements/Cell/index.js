import React from 'react'
import registerState from '../../xblock/registerState'

const getCell = (key) => {
  const button = registerState.cell.find(item => item.key === key)
  return button?.component ? button.component : null
}
export default function Column(props) {
  const {header: {render = 'text', index}, extension = {}, value} = props
  let ColumnComponent = getCell(render)
  if (extension[index] && extension[index]) ColumnComponent = extension[index]
  return ColumnComponent ? <ColumnComponent {...props} /> : <div>该Cell组件未注册</div>
}
