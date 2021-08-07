import React, {Component} from 'react'
import getAction from '../../action'
import {connect} from 'dva'
import {BlockComponent} from '_blocks'
import Card from '_components/ContainerCard'
import register from '_xblock/register'
import AddForm from '_components/Form/AddForm'
import CommonForm from '_components/Form/CommonForm'
import EditForm from '_components/Form/EditForm'
import TopFilterForm from '../../components/Form/TopFilterForm/new'
import {Tabs, Row, Col, Empty, Skeleton, Card as AntdCard, message} from 'antd'
import blockStructure from '_tools/block'
import BaseCard from '../../cards/ColorHeaderCard'
import {goPage, parseString, parseUrl} from '_tools/helper'
import showExportModal from '_components/Modals/ExportModal'
import showImportModal from '_components/Modals/ExcelImportModal'
import showImportResult from '_components/Modals/ImprotResult'
import InnerButton from '_elements/Button/InnerButton'
import TopButton from '_elements/Button/TopButton'
import Input from '_elements/Input'
import Cell from '_elements/Cell'
import * as Type from '_tools/type'


const TabPane = Tabs.TabPane

@connect(({'@@container': {blockData, loading, commonFormVisible, selectedValue}, loading: {effects}}) => ({
  blockData,
  loading,
  commonFormVisible,
  selectedValue,
  fetchLoading: effects['@@container/getBlock'],
}))
export default class BasicContainer extends Component {

  constructor(props) {
    super(props)
    const {
      getBlock,
      changeCommonFormVisible,
      changeAddFormVisible,
      changeEditFormVisible,
      exportBlock,
      importBlock
    } = getAction(this.props.dispatch)
    this.getBlock = getBlock
    this.changeAddFormVisible = changeAddFormVisible
    this.changeEditFormVisible = changeEditFormVisible
    this.changeCommonFormVisible = changeCommonFormVisible
    this.exportBlock = exportBlock
    this.importBlock = importBlock
  }

  state = {
    initParam: {},
    timestamp: 0,
  }
  block = null

  init() {
    const {match: {params = {}}, index, dispatch} = this.props
    this.event = {
      add: (value) => this.action('add', value),
      edit: (value) => this.action('edit', value),
      delete: (value) => this.action('delete', value),
      select: (value) => this.onChange(value),
      action: (action, value, showLoading) => this.action(action, value, showLoading),
      refresh: () => this.setState({timestamp: new Date().getTime()}),
    }
    this.config = register.getBlockConfig(index, {
      getBlock: this.getBlockData,
      ...this.event,
      relationUuid: params?.relation_uuid,
      container: this,
      dispatch,
    })

    this.state.initParam = {...params, ...this.config.initParam}
    this.state.initPaginate = this.config.initPaginate
    this.state.initSort = this.config.initSort
  }

  componentWillMount() {
    this.init()
    const {match: {params = {}}} = this.props
    const {location: {query = {}}, setTitle} = this.props
    const block = this.getBlockData()
    if (block) {
      const {pagination, parameter, sorting} = block
      this.onChange({
        parameter: {...parameter, ...query, relation_uuid: params?.relation_uuid},
        pagination,
        sorting,
      }, true).then(({data}) => setTitle && setTitle(data?.title))
    } else this.onChange({parameter: {...query}}, true).then(({data}) => setTitle && setTitle(data?.title))
  }

  componentDidMount() {
    const block = this.getBlockData()
    if (this.props.setTitle && block) {
      this.props.setTitle(block.title)
    }

  }

  fetchBlock(action, option) {
    return this.getBlock(this.props.index, action, option, this.props?.match?.path)
  }

  getBlockData(data) {
    const {index, blockData} = this.props
    this.block = data ? data[index] : blockData[index]
    return this.block;
  }

  getLoading(action) {
    const {index, loading} = this.props
    return (action ? loading?.[index]?.[action] : loading?.[index])
  }

  onChange = (query = {}, init = false) => {
    const {pagination, parameter, sorting} = query
    const {initParam, initPaginate, initSort} = this.state
    return this.fetchBlock('list', {
      pagination: {...initPaginate, ...pagination},
      parameter: {...initParam, ...parameter},
      sorting: init ? {...initSort, ...sorting} : {...sorting},
    })
  }

  action = (action, value, showLoading = true) => {
    const {pagination, parameter, sorting, index, primary_key} = this.getBlockData()
    const {selectedValue} = this.props
    if (showLoading) message.loading({
      content: '操作中...',
      duration: 0,
      key: `${index}${action}`
    })
    return this.fetchBlock(action, {...value, parameter}).then((res) => {
      message.destroy(`${index}${action}`)
      if (res.type === 'form') {
        this.changeCommonFormVisible(index, true, {
          index: action,
          form: res.data,
        }, value)
      } else if (res?.success) {
        if (Type.isArray(selectedValue?.[index]?.[primary_key])) {
          const obj = {}
          obj[primary_key] = []
          this.props.dispatch({
            type: '@@container/saveSelectedValue',
            value: {...selectedValue?.[index], ...obj},
            index: index
          })
        }
        this.onChange({
          pagination,
          parameter,
          sorting,
        })
      }
      return res
    })

  }

  onClick = (action, {value, button}) => {
    let event = this.config?.event?.[action]
    if (this.config?.event?.[action]) {
      return event({value, dispatch: this.props.dispatch, event: this.event})
    } else {
      if (button?.link) {
        let href = button.link
        let self = false
        if (Type.isObject(button.link)) {
          href = button.link.href
          self = button.link.self
        }
        if (href.substr(0, 4) === 'http') {
          const newUrl = parseString(href, value)
          if (self) return window.location.href = newUrl
          return window.open(newUrl)
        } else {
          goPage(href, value, true)
        }
      } else {
        switch (action) {
          case 'return':
            return window.history.go(-1)
          case 'export': {
            const {
              pagination,
              parameter,
              sorting, header, title,
            } = this.getBlockData()
            return showExportModal((v) => {
              return this.exportBlock(this.props.index, {
                pagination,
                parameter,
                sorting,
                ...v,
              }, this.props?.match?.path)
            }, header, title, pagination.page)
          }
          case 'import':
            return showImportModal(() => {
              return this.exportBlock(this.props.index, {
                is_sample: true,
              }, this.props?.match?.path)
            }, (file) => {
              return this.importBlock(this.props.index, {file}, this.props?.match?.path).then(res => {
                this.event.select()
                showImportResult(res, this.props.dispatch)
              })
            })
          default:
            return this.action(action, value)
        }
      }

    }

  }

  getTabState(block) {
    if (block?.tab_key) {
      const {header = [], parameter = {}, tab_key: tabKey} = block
      const tabHeader = header.find(item => item.index === tabKey)
      if (tabHeader?.dict?.length > 0) {
        const tabItem = tabHeader.dict
        tabHeader.filterable = false
        const active = parameter[tabKey] ? parameter[tabKey] : null
        return {tabItem, active}
      }
    }
    return {tabItem: [], active: null}
  }

  onTabChange(value, tabKey, parameter) {
    const filter = {}
    filter[tabKey] = value
    this.setInitParam(filter)
    this.onChange({
      pagination: {},
      parameter: {...parameter, ...filter},
      sorting: {},
    })
  }

  setInitParam = (parameter) => {
    this.setState({initParam: {...this.state.initParam, ...parameter}})
  }

  render() {
    const {key, index, dispatch, user, fetchLoading, commonFormVisible, selectedValue} = this.props
    const block = this.getBlockData()
    const loading = this.getLoading('list')
    if (block) {
      blockStructure(block)
      const Component = this.config.component ? this.config.component : BlockComponent
      const TopExtra = this.config.topExtra
      const BottomExtra = this.config.bottomExtra
      const LeftExtra = this.config.leftExtra
      const leftExtraWidth = LeftExtra ? (this.config.leftExtraWidth || 1) : 0
      const RightExtra = this.config.rightExtra
      const componentProps = this.config.props ? this.config.props : {}
      const rightExtraWidth = RightExtra ? (this.config.rightExtraWidth || 1) : 0
      const {tabItem, active} = this.getTabState(block)
      const primaryKey = block.primary_key
      const buttonProps = {
        event: this.event,
        extension: this.config?.button ? this.config.button : {},
        dispatch,
        primaryKey,
        index,
        loading: this.getLoading()
      }
      const props = {
        key, block, loading, user, dispatch, blockConfig: this.config,
        event: this.event,
        setInitParam: this.setInitParam,
        changeAddFormVisible: (v) => this.changeAddFormVisible(index, v),
        changeEditFormVisible: (v, value) => this.changeEditFormVisible(index, v, value),
        changeCommonFormVisible: (status, button, value) => this.changeCommonFormVisible(index, status, button, value),
        onClick: this.onClick,
        onChange: this.onChange,
        InnerButton: (props) => <InnerButton button={block.getInnerButton()} {...buttonProps} {...props}/>,
        TopButton: (props) => <TopButton onClick={(button) => {
          const value = selectedValue[index] ? selectedValue[index] : {}
          if (button.form) return this.changeCommonFormVisible(index, true, button, value)
          if (button.index === 'add') return this.changeAddFormVisible(index, true)
          this.onClick(button.index, {value, button})
        }} event={this.event} button={block.getTopButton()} {...buttonProps} {...props}/>,
        Input: (props) => <Input index={index} {...props} extension={this.config?.input ? this.config.input : {}}
                                 primaryKey={primaryKey}/>,
        Cell: (props) => <Cell index={index} event={this.event} {...props} dispatch={dispatch} primaryKey={primaryKey}
                               extension={this.config?.cell ? this.config.cell : {}}/>,
      }

      return <Col span={block.width || 24} style={{marginBottom: 25}}>
        {block.getFilterHeader().length > 0 &&
        <AntdCard style={{margin: '0 0 10px', padding: 0}} bodyStyle={{padding: '20px 20px 0 20px'}}>
          <TopFilterForm index={index} parameter={block.parameter} expand={block.filter_expand} onChange={this.onChange}
                         primaryKey={primaryKey}
                         header={block.header.filter(i => i.filterable && i.filter_position === 'top')}
                         Input={props.Input}/>
        </AntdCard>}

        <Card block={block}
              onClick={this.onClick}
              setInitParam={this.setInitParam}
              onChange={this.onChange}
              loading={loading}
              TopButton={props.TopButton}
              sync>
          {
            (tabItem && tabItem.length > 0) &&
            <Tabs type={'card'} tabBarGutter={5} activeKey={active}
                  onChange={(value) => this.onTabChange(value, block.tab_key, block.parameter)}>
              {tabItem.map(item => <TabPane tab={item.text} key={item.value}/>)}
            </Tabs>
          }

          <AddForm index={index} header={block.getAddHeader()} primaryKey={primaryKey} loading={this.getLoading('add')}
                   changeAddFormVisible={(v) => this.changeAddFormVisible(index, v)}
                   onOk={(value) => this.onClick('add', {value})} Input={props.Input}/>
          {commonFormVisible[index] && <CommonForm index={index} header={block.getAddHeader()} primaryKey={primaryKey}
                                                   loading={this.getLoading()}
                                                   changeCommonFormVisible={(v, button) => this.changeCommonFormVisible(index, v, button)}
                                                   onOk={(value, action) => this.onClick(action, {value: {...selectedValue[index], ...value}})
                                                   }
                                                   Input={props.Input}/>}
          {TopExtra && <TopExtra {...props}/>}
          <EditForm index={index} header={block.header.filter(i => (i.editable) && i.index !== primaryKey)}
                    primaryKey={primaryKey}
                    loading={this.getLoading('edit')}
                    changeEditFormVisible={(v) => this.changeEditFormVisible(index, v)}
                    Input={props.Input}
                    onOk={(value) => this.onClick('edit', {value})}/>
          <Row>
            <Col span={leftExtraWidth}><Col>{LeftExtra && <LeftExtra {...props}/>}</Col></Col>
            <Col span={24 - leftExtraWidth - rightExtraWidth}><Component {...props} {...componentProps}/></Col>
            <Col span={rightExtraWidth}>{RightExtra && <RightExtra {...props}/>}</Col>
          </Row>


          {BottomExtra && <BottomExtra {...props}/>}
        </Card></Col>
    } else {
      return <div style={{width: '100%'}}>
        <AntdCard>
          <Skeleton loading={fetchLoading || loading} style={{width: '100%'}}>
            <Empty/>
          </Skeleton>
        </AntdCard>
      </div>
    }
  }
}
