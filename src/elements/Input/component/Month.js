import React from 'react'
import {DatePicker} from 'antd'

const {MonthPicker} = DatePicker
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
import moment from 'moment'
import BraftEditor from "braft-editor";

moment.locale('zh-cn')

export default function ({value, onChange, header, mode, ...rest}) {
  return <MonthPicker locale={locale} style={{width: '100%'}}
                      placeholder="选择月份"
                      format="YYYY-MM"
                      {...header?.property}
                      value={value ? moment(value, 'YYYY-MM') : null}
                      onChange={(value) => onChange(value ? value.format('YYYY-MM') : null)} {...rest}/>
}
