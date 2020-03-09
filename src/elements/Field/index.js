import React from 'react'
import registerState from '../../xblock/registerState'
import { connect } from 'dva'

class Field extends React.Component {

  getInput (key) {
    const button = registerState.input.find(item => item.key === key)
    return button?.component ? button.component : null
  }

  onChange = (v) => {
    const {resetChildrenValue, onChange} = this.props
    onChange(v)
    this.setValueToStore(v)
    resetChildrenValue()
  }

  setValueToStore (value) {
    const {dispatch, mode, header: {index, parent}, index: blockIndex, onChange} = this.props
    const payload = {}
    payload[`${blockIndex}-${index}`] = {value, save: onChange, parent: `${blockIndex}-${parent}`}
    dispatch({
      type: `@@element/${mode}Parent`,
      payload,
    })
  }

  componentDidMount () {
    this.setValueToStore(this.props.value)
  }

  render () {
    const {extension = {}, ...rest} = this.props
    const {header: {input = 'text', index, addable = true, editable = true, filterable = true}, mode = 'edit'} = this.props
    let Field = this.getInput(input)
    if (extension[index] && extension[index]) Field = extension[index]
    let disabled = false
    if (mode === 'add') disabled = !addable
    else if (mode === 'filter') disabled = !filterable
    else disabled = !editable
    return Field ? <Field disabled={disabled} {...rest} onChange={this.onChange}/> :
      <span style={{color: 'red'}}>【{input}】组件未注册！</span>
  }
}

export default connect(({'@@element': {element}}) => ({element}))((props) => {
  const {header: {parent, index: headerIndex}, index, mode = 'edit', element, header, ...rest} = props
  const parentValue = element[mode]?.[`${index}-${parent}`]?.value ? element[mode][`${index}-${parent}`].value : null
  const resetChildrenValue = () => {
    Object.keys(element[mode]).map(i => {
      if (element[mode][i]?.parent === `${index}-${headerIndex}` && element[mode][i].save) {
        element[mode][i].save(null)
      }
    })
  }
  return <Field header={header} index={index} mode={mode} {...rest} parentValue={parentValue}
                resetChildrenValue={resetChildrenValue}/>
})
