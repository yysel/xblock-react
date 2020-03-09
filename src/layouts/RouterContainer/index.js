import React from 'react'
import { Route } from 'dva/router'
import registerState from '../../xblock/registerState'
import NoAccess from '../../components/Exception/403'
import { checkAuthority } from '../../tools/auth'
import BasicContainer from './Container';
import { trim } from '../../tools/string'
let firstPath = null
const parseRoute = (router, menuRouter, user, rootPath) => {
  if (router.children && router.children.length > 0) {
    return router.children.map((item) => parseRoute(item, menuRouter, user, rootPath))
  }
  const res = checkAuthority(router.permission, user?.permission, true, false)
  const Component = res ? BasicContainer : NoAccess
  if (!firstPath && res) firstPath = router.path
  if (router.block && router.block instanceof Array) {
    menuRouter.push(<Route key={router.path}
                           path={rootPath === '/' ? router.path : `/${trim(rootPath, '/')}/${trim(router.path, '/')}`}
                           exact
                           component={(props) => <Component {...props} user={user} block={router.block}/>}/>)
  } else return null

}

export default function RouterContainer (props) {
  const {menu, user, rootPath} = props
  const menuRouter = [];
  [...registerState.menu, ...menu].map((item) => parseRoute(item, menuRouter, user, rootPath))
  return menuRouter
}

//获取重定向地址
RouterContainer.getRedirect = () => firstPath

