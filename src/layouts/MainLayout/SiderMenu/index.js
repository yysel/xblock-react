import React, { PureComponent } from 'react'
import { Layout, Menu, Badge } from 'antd'
import Icon from '@ant-design/compatible/lib/icon'
import pathToRegexp from 'path-to-regexp'
import { Link } from 'dva/router'
import { urlToList } from './pathTools'
import { checkAuthority } from '../../../tools/auth'
import { connect } from 'dva'
import getAction from '../../../action'

const {Sider} = Layout
const {SubMenu} = Menu

const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className='xblock-sider-menu-icon sider-menu-item-img'/>
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} className='xblock-sider-menu-icon'/>
  }
  return icon
}

export const getMeunMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path)
  })
}

@connect(({'@@app': {logo, title}, '@@xblock': {collapsed}}) => ({
  logo, collapsed, title
}))
export default class SiderMenu extends PureComponent {
  constructor (props) {
    super(props)
    this.flatMenuKeys = this.getFlatMenuKeys(this.props.menuData)
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(this.props),
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps),
      })
    }
  }

  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus (props) {
    const {location: {pathname}} = props || this.props
    return urlToList(pathname)
      .map(item => {
        return getMeunMatcheys(this.getFlatMenuKeys(this.props.menuData), item)[0]
      })
      .filter(item => item)
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys (menus) {
    let keys = []
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children))
      }
      keys.push(item.path)
    })
    return keys
  }

  onCollapse = collapsed => {
    getAction(this.props.dispatch).changeLayoutCollapsed({
      payload: collapsed,
    })
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path)
    const icon = getIcon(item.icon)
    const {target, title} = item
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{title}</span>
        </a>
      )
    }
    return item.path !== '/index' ?
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isMobile
            ? () => {
              this.onCollapse(true)
            }
            : undefined
        }
      >
        <Badge count={item.count} offset={[23, 5]} showZero>
          {icon}
          <span>{title}</span>
        </Badge>
      </Link>
      : <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isMobile
            ? () => {
              this.onCollapse(true)
            }
            : undefined
        }
      >
        {icon}
        <span>{title}</span>
      </Link>
  }
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    let count = 0
    item.children.map(function (i) {

      if (i.count) {
        count += i.count * 1
      }
    })
    if (item.children && item.children.some(child => child.title)) {
      const childrenItems = this.getNavMenuItems(item.children)
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                item.path !== '/index' ?
                  <Badge count={count ? count : ''} offset={[20, 5]} showZero>
                    <span>
                        {getIcon(item.icon)}
                      <span>{item.title}</span>
                      </span>
                  </Badge>
                  : <span>
                      {getIcon(item.icon)}
                    <span>{item.title}</span>
                    </span>
              ) : (
                item.title
              )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        )
      }
      return null
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
    }
  }
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return []
    }
    return menusData.filter(item => item.title && item.visible).map(item => {
      // make dom
      const ItemDom = this.getSubMenuOrItem(item)

      // return ItemDom;
      return checkAuthority(item.permission, this.props.user.permission, ItemDom, null)
    })
      .filter(item => item)
  }
  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {location: {pathname}} = this.props
    return urlToList(pathname).map(itemPath => getMeunMatcheys(this.getFlatMenuKeys(this.props.menuData), itemPath).pop())
  }
  // conversion Path
  // 转化路径
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/')
    }
  }

  isMainMenu = key => {
    return this.props.menuData.some(item => key && (item.key === key || item.path === key))
  }
  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    })
  }

  render () {
    const {logo, title, collapsed} = this.props
    const {openKeys} = this.state
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
        openKeys,
      }
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys()
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]]
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={this.onCollapse}
        width={256}
        className={collapsed ? 'xblock-sider-menu-nocollapsed' : 'xblock-sider-menu-collapsed'}
      >
        <div className='xblock-sider-menu-logo' key="logo">
          <Link to="/">
            <img src={logo}/>
            <h1>{title}</h1>
          </Link>
        </div>
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{padding: '16px 0'}}
        >
          {
            this.getNavMenuItems(this.props.menuData)
          }
        </Menu>
      </Sider>
    )
  }
}

