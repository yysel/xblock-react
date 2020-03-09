import appModel from './models/app'
import xblock from './models/xblock'
import container from './models/container'
import Fetch from './fetch'
import { logout } from './action'
import Login from './layouts/UserLayout/Login.js'
import Table from '@xblock-component/table/lib/info'

export default function (app) {
  app.model(appModel)
  app.model(xblock)
  app.model(container)
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
  Fetch.after = ({code}) => {
    if (code === '3003') {
      logout()
    }
  }
}