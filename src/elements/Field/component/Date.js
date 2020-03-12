import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

export default function ({value = null, onChange, mode, ...rest}) {
  return <DatePicker style={{width: '100%'}}
                     placeholder="选择日期"
                     format="YYYY-MM-DD"
                     value={value ? moment(value, 'YYYY-MM-DD') : null}
                     onChange={(value) => onChange(value ? value.format('YYYY-MM-DD') : null)} {...rest}/>
}
