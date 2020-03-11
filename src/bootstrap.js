import appModel from './models/app'
import xblock from './models/xblock'
import container from './models/container'
import element from './models/element'
import Fetch from './fetch'
import { logout } from './action'
import Login from './layouts/UserLayout/Login.js'
import Table from './blocks/Table/info'
import ButtonRegisterList from './elements/Button/registerList'
import ColumnRegisterList from './elements/Column/registerList'
import FieldRegisterList from './elements/Field/registerList'

export default function (app) {
  app.model(appModel)
  app.model(xblock)
  app.model(container)
  app.model(element)
  app.register.userRouter([
    {
      path: '/user/info',
    },
    {
      path: '/user/login/:path',
      component: Login,
    },
  ])
  app.register.blockComponent(Table)
  app.register.button(ButtonRegisterList)
  app.register.input(FieldRegisterList)
  app.register.cell(ColumnRegisterList)
  Fetch.after = ({code}) => {
    if (code === '3003') {
      logout()
    }
  }
}