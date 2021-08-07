import React, {PureComponent} from 'react';
import {Select, Input, Row, Button} from 'antd';

const {Option} = Select;
export default class SelectRadio extends PureComponent {

  state = {
    input: null,
    inputValue: '',
  };

  render() {
    const {
      header,
      parentValue,
      onChange,
      id,
      index,
      mode,
      primaryKey,
      resetChildrenValue,
      dispatch,
      ...rest
    } = this.props;
    const custom = header.property.custom;
    const {input, inputValue} = this.state;
    const filterItem = header.parent ? header.dict.filter(item => (!parentValue) || item.parent == parentValue) : header.dict;
    return input ? <Row>
      <Input style={{width: '100%'}} placeholder={'自定义选项'}
             onChange={(e) => this.setState({inputValue: e.target.value})}
             addonAfter={<Button size='small' type='primary' block onClick={() => {
               this.setState({input: false});
               onChange(inputValue);
             }}>确定</Button>}/>
    </Row> : (
      <Row>
        <Select style={{width: custom ? '80%' : '100%'}}
                showSearch
                allowClear
                placeholder="请选择"
                optionFilterProp="children"
                {...header?.property}
                filterOption={(input, option) => option.props.children && option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} {...rest}
                onChange={onChange}
        >
          {filterItem.map((item) => {
            return (
              !item.disable ? <Option key={item.value} value={item.value}>{item.text}</Option> : null
            );
          })}
        </Select>
        {custom &&
        <a style={{marginLeft: 5}} size='small' type='primary' onClick={() => this.setState({input: true})}>添加选项</a>}
      </Row>
    );
  }
}
