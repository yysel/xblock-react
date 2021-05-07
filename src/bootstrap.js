import xblock from './models/xblock'
import container from './models/container'
import element from './models/element'
import Fetch from './fetch'
import getAction from './action'
import Login from './layouts/UserLayout/Login.js'
import Table from './blocks/Table/info'
import Detail from './blocks/Detail/info'
import ButtonRegisterList from './elements/Button/registerList'
import ColumnRegisterList from './elements/Cell/registerList'
import FieldRegisterList from './elements/Input/registerList'
import Provider from './xblock/Provider'
import access from './extension/access'
import appModel from '_models/app'

export default class Bootstrap extends Provider {

  boot() {
    const app = this.app
    //注册相关model

    app.model(xblock)
    app.model(container)
    app.model(element)
    app.model(appModel)
    //注册无状态路由
    app.register.userRouter([
      {
        path: '/user/info',
      },
      {
        path: '/user/login/:path',
        component: Login,
      },
    ])
    //注册系统组件
    app.register.blockComponent([Table, Detail])
    app.register.button(ButtonRegisterList)
    app.register.input(FieldRegisterList)
    app.register.cell(ColumnRegisterList)
    app.register.input(access)

    //注册fetch钩子函数
    Fetch.after = ({code}) => {
      if (code === '3003') {
        getAction().logout()
      }
    }

  }

  register() {

  }

}
