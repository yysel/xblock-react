import React from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
moment.locale('zh-cn');

export default function({ value, onChange, ...rest }) {
  return <DatePicker locale={locale} style={{ width: '100%' }}
                     placeholder="选择日期"
                     format="YYYY-MM-DD"
                     value={value ? moment(value, 'YYYY-MM-DD') : null}
                     onChange={(value) => onChange(value ? value.format('YYYY-MM-DD') : null)} {...rest}/>;
}
