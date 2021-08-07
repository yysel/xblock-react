import React, {PureComponent} from 'react';
import {Col, Row, Input, DatePicker, TimePicker} from 'antd';
import Moment from 'moment';
import locale from "antd/lib/date-picker/locale/zh_CN";

const InputGroup = Input.Group;
export default class DateTime extends PureComponent {

  state = {
    first: true,
  };

  onDateChange(change) {
    const {value, onChange} = this.props;
    const date = change ? change.format('YYYY-MM-DD') : null;
    const time = value ? Moment(value).format('HH:mm:ss') : Moment().format('HH:mm:ss');
    onChange(time && date ? `${date} ${time}` : null);
    this.state.first = false;
  }

  onTimeChange(change, yy, ee) {
    const {value, onChange} = this.props;
    const date = value ? Moment(value).format('YYYY-MM-DD') : Moment().format('YYYY-MM-DD');
    const time = change ? change.format('HH:mm:ss') : null;
    onChange(date && time ? `${date} ${time}` : null);
  }

  render() {
    const {value, format, header: {property: {date = {}, time = {},time_format}}
    , ...rest} = this.props;
    return (<InputGroup compact>
      <DatePicker locale={locale} style={{width: '50%'}} format={'YYYY-MM-DD'} {...date}
                  value={value ? Moment(value, 'YYYY-MM-DD') : null} onChange={this.onDateChange.bind(this)}/>
      <TimePicker style={{width: '50%'}}
                  format={time_format ? time_format : 'HH:mm:ss'}
                  {...time}
                  onChange={this.onTimeChange.bind(this)}
                  value={value ? Moment(value) : null}/>
    </InputGroup>);
  }
}
