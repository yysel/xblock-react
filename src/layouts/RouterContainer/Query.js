import React, { Component } from 'react'
import { getBlock, changeAddFormVisible, changeEditFormVisible, exportBlock } from '../../action'
import { connect } from 'dva'
import { BlockComponent } from '../../blocks'
import Card from '../../components/ContainerCard'
import register from '../../xblock/register'
import AddForm from '../../components/Form/AddForm'
import EditForm from '../../components/Form/EditForm'
import TopFilterForm from '../../components/Form/TopFilterForm'
import { Tabs, Row, Col, Empty, Skeleton } from 'antd'
import blockStructure from '../../tools/block'
import BaseCard from '../../cards/ColorHeaderCard'
import { goPage } from '../../tools/helper'
import ExportModal from '../../components/Modals/ExportModal'
import InnerButton from '../../elements/Button/InnerButton'
import TopButton from '../../elements/Button/TopButton'
import Field from '../../elements/Field'
import Column from '../../elements/Column'

const TabPane = Tabs.TabPane

@connect(({'@@container': {blockData, loading, addFormVisible, editFormVisible}, loading: {effects}}) => ({
  blockData,
  loading,
  addFormVisible,
  editFormVisible,
  fetchLoading: effects['@@container/getBlock'],
}))
export default class BasicContainer extends Component {
  state = {
    initParam: {},
    timestamp: 0,
  }

  init () {
    const {match: {params = {}}, index, dispatch} = this.props
    this.event = {
      add: (value) => this.action('add', value),
      edit: (value) => this.action('edit', value),
      delete: (value) => this.action('delete', value),
      select: (value) => this.onChange(value),
      action: (action, value) => this.action(action, value),
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

  componentWillMount () {
    this.init()
    const {match: {params = {}}} = this.props
    const {location: {query = {}}} = this.props
    const block = this.getBlockData()
    if (block) {
      const {pagination, parameter, sorting} = block
      this.onChange({
        parameter: {...parameter, ...query, relation_uuid: params?.relation_uuid},
        pagination,
        sorting,
      }, true)
    } else this.onChange({parameter: {...query}}, true)
  }

  fetchBlock (action, option) {
    return getBlock(this.props.index, action, option, this.props?.match?.path)
  }

  getBlockData (data) {
    const {index, blockData} = this.props
    return data ? data[index] : blockData[index]
  }

  getLoading (data) {
    const {index, loading} = this.props
    return data ? data[index] : loading[index]
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

  action = (action, value) => {
    const {pagination, parameter, sorting} = this.getBlockData()
    return this.fetchBlock(action, {...value, parameter}).then((res) => {
      this.onChange({
        pagination,
        parameter,
        sorting,
      })
      return res
    })

  }

  onClick = (action, {value, button}) => {
    let event = this.config?.event?.[action]
    if (this.config?.event?.[action]) {
      return event({value, dispatch: this.props.dispatch, event: this.event})
    } else {
      if (button?.link) {
        goPage(button?.link, value, true)
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
            ExportModal((v) => {
              return exportBlock(this.props.index, {
                pagination,
                parameter,
                sorting,
                ...v,
              }, this.props?.match?.path)
            }, header, title, pagination.page)
          }

          case 'detail':
            return
          case 'add':
          case 'delete':
          case 'edit':
          default:
            return this.action(action, value)
        }
      }

    }

  }

  getTabState (block) {
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

  onTabChange (value, tabKey, parameter) {
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

  render () {
    const {menu, key, index, dispatch, user, fetchLoading} = this.props
    const block = this.getBlockData()
    const loading = this.getLoading()
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
      const buttonProps = {
        event: this.event,
        extension: this.config?.button ? this.config.button : {},
        dispatch,
      }
      const props = {
        key, block, loading, user, dispatch, blockConfig: this.config,
        event: this.event,
        setInitParam: this.setInitParam,
        changeAddFormVisible: (v) => changeAddFormVisible(index, v),
        changeEditFormVisible: (v, value) => changeEditFormVisible(index, v, value),
        onClick: this.onClick,
        onChange: this.onChange,
        InnerButton: (props) => <InnerButton button={block.getInnerButton()} {...buttonProps} {...props}
                                             extension={this.config?.button ? this.config.button : {}}/>,
        TopButton: (props) => <TopButton button={block.getTopButton()} {...buttonProps} {...props}
                                         extension={this.config?.button ? this.config.button : {}}/>,
        Input: (props) => <Field index={index} {...props} extension={this.config?.input ? this.config.input : {}}/>,
        Cell: (props) => <Column event={event} {...props} dispatch={dispatch}
                                 extension={this.config?.cell ? this.config.cell : {}}/>,
      }

      return <Col span={block.width || 24}> <Card block={block} onClick={this.onClick} setInitParam={this.setInitParam}
                                                  onChange={this.onChange} key={key} spin={loading}
                                                  recycle={block.recyclable} sequence={key}
                                                  menu={menu}
                                                  sync>
        {
          (tabItem && tabItem.length > 0) &&
          <Tabs type={'card'} tabBarGutter={5} activeKey={active}
                onChange={(value) => this.onTabChange(value, block.tab_key, block.parameter)}>
            {tabItem.map(item => <TabPane tab={item.text} key={item.value}/>)}
          </Tabs>
        }
        <TopFilterForm index={index} parameter={block.parameter} onChange={this.onChange}
                       header={block.header.filter(i => i.filterable && i.filter_position === 'top')}
                       Input={props.Input}/>

        <AddForm index={index} header={block.getAddHeader()}
                 changeAddFormVisible={(v) => changeAddFormVisible(index, v)}
                 onOk={(value) => this.onClick('add', {value})} Input={props.Input}/>
        {TopExtra && <TopExtra {...props}/>}
        <EditForm index={index} header={block.header.filter(i => (i.editable) && i.index !== 'uuid')}
                  changeEditFormVisible={(v) => changeEditFormVisible(index, v)}
                  Input={props.Input}
                  onOk={(value) => this.onClick('edit', {value})}/>
        <Row>
          <Col span={leftExtraWidth}><Col>{LeftExtra && <LeftExtra {...props}/>}</Col></Col>
          <Col span={24 - leftExtraWidth - rightExtraWidth}><Component {...props} {...componentProps}/></Col>
          <Col span={rightExtraWidth}>{RightExtra && <RightExtra {...props}/>}</Col>
        </Row>


        {BottomExtra && <BottomExtra {...props}/>}
      </Card></Col>
    }
    return <BaseCard title={(fetchLoading || loading) ? (this.props.sequence > 0 ? null : '加载中...') : ' '}
                     titleStyle={{color: '#131313'}}><Skeleton
      loading={fetchLoading || loading}><Empty/></Skeleton></BaseCard>
  }
}
