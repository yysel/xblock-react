import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { connect } from 'dva'
import { Route, Redirect, Switch } from 'dva/router'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import GlobalHeader from './Header'
import SiderMenu from './SiderMenu'
import NotFount from '../../components/Exception/404'
import RouterContainer from '../RouterContainer'
import registerState from '../../xblock/registerState'

import getAction from '../../action'
// import ThemeConfig from '../../../../src/common/ThemeConfig';

const {Content, Header} = Layout

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = []
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      })
      item.children.forEach(children => {
        getRedirect(children)
      })
    }
  }
}

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {}
  const childResult = {}
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData))
    }
  }
  return Object.assign({}, routerData, result, childResult)
}

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}

let isMobile
enquireScreen(b => {
  isMobile = b
})

@connect(({'@@xblock': {currentUser, mainLayoutMenu}, loading}) => ({
  currentUser: currentUser,
  menuData: mainLayoutMenu,
  fetchingMenu: loading.effects['global/fetchMenu'],
}))
export default class AdminLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile: false,
    menuBlock: {},
    lock: false
  }

  getChildContext () {
    const {location, routerData = [], menuData} = this.props
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(menuData, routerData),
    }
  }

  componentWillMount () {
    registerState.mount.bind(this)
    registerState.mount(this.props)
    const {getMenu, getUser} = getAction(this.props.dispatch)
    getUser()
    getMenu({
      payload: false,
      callback: () => {
        this.setState({lock: true})
      },
    })

  }

  componentDidMount () {
    registerState.mounted.bind(this)
    registerState.mounted(this.props)
    document.documentElement.onkeydown = (ev) => {
      if (ev.shiftKey && ev.keyCode === 8) {
        window.history.go(-1)
      }
    }

    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      })
    })
  }

  componentWillUnmount () {
    unenquireScreen(this.enquireHandler)

    document.documentElement.onkeydown = () => {
      return null
    }

  }

  render () {
    const {
      currentUser,
      location,
      menuData = [],
      rootPath,
    } = this.props
    const menuRouter = RouterContainer({menu: menuData, user: currentUser, rootPath})
    const baseRedirect = RouterContainer.getRedirect()
    const layout = (
      <Layout>
        <SiderMenu
          user={this.props.currentUser}
          menuData={[...registerState.menu, ...menuData]}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        {/*<ThemeConfig/>*/}

        <Layout style={{width: '100%'}}>
          <Header style={{padding: 0}}>
            <GlobalHeader
              isMobile={this.state.isMobile}
              baseRedirect={baseRedirect}
            />
          </Header>
          <Content style={{margin: '24px 24px 0', height: '100%'}}>
            <Switch>
              {menuRouter}
              {registerState.router.map(route => <Route key={route.path}
                                                        path={route.path} exact
                                                        component={route.component}/>,
              )}
              {(this.state.lock && baseRedirect) && <Redirect exact from="/" to={baseRedirect}/>}
              {this.state.lock && <Route render={NotFount}/>}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )

    return (
      <ContainerQuery query={query}>
        {params => <div className={classNames(params)}>{layout}</div>}
      </ContainerQuery>
    )
  }
}


