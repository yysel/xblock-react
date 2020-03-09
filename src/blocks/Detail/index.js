import React, { PureComponent } from 'react';
import { Descriptions, Col, Row, Form, Button } from 'antd';
import { FormRule, Field, Column } from '_element';
import Loading from '_component/Loading';

const FormItem = Form.Item;
export default class CommonDetail extends PureComponent {
  state = {
    editStatus: false,
    validateFields: null,
    resetFields: null,
  };

  onButtonClick(button, firstContent) {
    if (button.index === 'edit' && !this.props.block?.property?.open_edit) this.setState({ editStatus: true });
    else this.props.onClick(button.index, { value: firstContent, button: button });
  }

  onEditButton = (value, uuid, onClick) => {
    const { block: { relation_index }, relationUuid } = this.props;
    if (uuid) {
      if (value.image) {
        if (value.image.indexOf('http') !== (-1)) {
          value.image = value.image.split('http://file.shineiot.cn:12100/').reverse()[0];
        }
        if (onClick) onClick('edit', {
          value: { ...value, uuid },
          button: {},
        }, { parameter: {} });
      } else {
        if (onClick) onClick('edit', {
          value: { ...value, uuid },
          button: {},
        }, { parameter: {} });
      }
    } else {
      const newValue = { ...value };
      newValue[relation_index] = relationUuid;
      if (onClick) onClick('add', { value: newValue, button: {} }, { parameter: {} });
    }
  };

  submit(onClick) {
    const { validateFields, resetFields } = this.state;
    if (validateFields) {
      validateFields((err, value) => {
        if (err) return;
        const filter = Object.keys(value).filter(k => value[k]);
        if (filter.length) {
          if (onClick) onClick(value);
          resetFields();
          this.setState({ editStatus: false });
        }
      });
    }
  }


  render() {
    const { block: { content, header, button, property: { column = 3, has_border = false, open_edit = false } }, TopButton, InnerButton, onClick, blockConfig = {}, event, loading } = this.props;
    const editStatus = open_edit ? true : this.state.editStatus;
    const firstContent = content[0] ? content[0] : {};
    const buttonOnTop = button ? button.filter(item => item.position === 'top') : [];
    const buttonOnBottom = button ? button.filter(item => item.position === 'inner') : [];
    const EditBoard = Form.create()(props => {
      const { form } = props;
      return (<Descriptions bordered={has_border} column={Number(column)}>
        {header.filter(it => it.visible).map(item => (
          <Descriptions.Item
            label={item.unit ? item.title + '（' + item.unit + '）' : item.title}
            span={item.width === 0 ? 1 : item.width}>
            <FormItem style={{ marginBottom: 0 }}>
              {
                form.getFieldDecorator(item.index, {
                  initialValue: firstContent ? firstContent[item.index] : null,
                  rules: FormRule(item),
                })(<Field header={item} style={{ width: '100%' }} mode={'edit'}
                          extension={blockConfig?.header ? blockConfig.header : {}}/>)
              }
            </FormItem>
          </Descriptions.Item>))}
      </Descriptions>);
    });
    const Board = () => <Descriptions bordered={has_border} column={Number(column)}>
      {header.filter(it => it.visible).map(item => (
        <Descriptions.Item label={item.unit ? item.title + '（' + item.unit + '）' : item.title}
                           span={item.width === 0 ? 1 : item.width}>{<Column value={firstContent[item.index]}
                                                                             header={item}
                                                                             row={firstContent} event={event}
                                                                             extension={blockConfig.column ? blockConfig.column : {}}/>}</Descriptions.Item>))}
    </Descriptions>;
    return <Loading loading={loading}>
      <Row>
        {buttonOnTop.length > 0 && <Col style={{ marginBottom: 20 }}> <TopButton button={buttonOnTop} spread={false}
                                                                                 value={firstContent}
                                                                                 onClick={(button) => {
                                                                                   open_edit ? this.submit((value) => {
                                                                                     this.onButtonClick(button, {
                                                                                       ...value,
                                                                                       uuid: firstContent.uuid,
                                                                                     });
                                                                                   }) : this.onButtonClick(button, firstContent);
                                                                                 }}
        /></Col>}
        <Col>
          {editStatus ?
            <EditBoard onClick={onClick} ref={(e) => {
              if (e) {
                this.state.validateFields = e.validateFields;
                this.state.resetFields = e.resetFields;
              }
            }}/> : <Board/>}
        </Col>
        {(editStatus && !open_edit) ? <Col style={{ textAlign: 'center', marginTop: 50 }}>
          <Button onClick={() => this.setState({ editStatus: false })}>取 消</Button>
          <Button type="primary" style={{ marginLeft: 8 }}
                  onClick={() => this.submit((value) => this.onEditButton(value, firstContent.uuid, onClick))}>保
            存</Button>
        </Col> : <Col style={{ marginTop: 50 }}><InnerButton value={firstContent}
                                                             onClick={(button) => {
                                                               open_edit ? this.submit((value) => {
                                                                 this.onButtonClick(button, {
                                                                   ...value,
                                                                   uuid: firstContent.uuid,
                                                                 });
                                                               }) : this.onButtonClick(button, firstContent);
                                                             }}
        /></Col>}
      </Row>
    </Loading>;
  }
}
