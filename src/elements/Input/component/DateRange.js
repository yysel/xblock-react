import React from 'react'
import {DatePicker} from 'antd'
import moment from 'moment'

const {RangePicker} = DatePicker

export default function ({value = null, header: {property}, onChange, mode, ...rest}) {
  const begin = value?.[0] ? moment(value[0]) : null
  const end = value?.[1] ? moment(value[1]) : null
  return <RangePicker style={{width: '100%'}}
                      format="YYYY-MM-DD"
                      {...property}
                      value={[begin, end]}
                      onChange={(value, valueString) => {
                        if (!value) onChange(undefined)
                        else onChange(valueString ? valueString : [])
                      }} {...rest} />
}
