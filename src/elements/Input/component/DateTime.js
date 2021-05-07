import React, {PureComponent} from 'react';
import {Col, Row, Input, DatePicker, TimePicker} from 'antd';
import Moment from 'moment';

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
    const {value, minuteStep, format, header: {property}, ...rest} = this.props;
    return (<InputGroup compact>
      <DatePicker onChange={this.onDateChange.bind(this)} style={{width: '50%'}} format={'YYYY-MM-DD'}
                  value={value ? Moment(value, 'YYYY-MM-DD') : null} {...property}/>
      <TimePicker minuteStep={minuteStep} style={{width: '50%'}}
                  format={property?.time_format ? property?.time_format : 'hh:mm:ss'}
                  onChange={this.onTimeChange.bind(this)}
                  value={value ? Moment(value) : null}/>
    </InputGroup>);
  }
}
