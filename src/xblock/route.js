import React from 'react'
import {Route, Switch, routerRedux} from 'dva/router'
import XBlock from './registerState'
import {ConfigProvider} from 'antd'
import locale from 'antd/lib/locale/zh_CN';
import DocumentTitleAndIcon from '../components/DocumentTitleAndIcon'

const {ConnectedRouter} = routerRedux

function RouterConfig({history, ...rest}) {
  const MainLayout = XBlock.mainLayout.component().default
  const UserLayout = XBlock.userLayout.component().default
  return (
    <ConfigProvider locale={locale}>
      <DocumentTitleAndIcon>
        <ConnectedRouter history={history}>
          <Switch>
            {XBlock.layout.map(i => <Route key={i.path} path={i.path} component={i.component}/>)}
            <Route path={XBlock.userLayout.path}
                   component={(props) => <UserLayout rootPath={XBlock.userLayout.path}  {...props} {...rest}/>}/>
            <Route path={XBlock.mainLayout.path}
                   component={(props) => <MainLayout rootPath={XBlock.mainLayout.path} {...props} {...rest} />}/>
            <Route render={() => '页面不存在'}/>
          </Switch>
        </ConnectedRouter>
      </DocumentTitleAndIcon>
    </ConfigProvider>
  )
}

export default RouterConfig
