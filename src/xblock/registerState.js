export default class RegisterState {
  static menu = []
  static router = []
  static userRouter = []
  static layout = []
  static api = {}
  static input = []
  static button = []
  static cell = []
  static blockComponent = [] //block组件
  static blockConfig = {}   //block扩展配置文件
  static mainLayout = {
    path: '/',
    component: () => require('../layouts/MainLayout'),
  }
  static dispatch = () => {}
  static getState = () => {}
  static userLayout = {
    path: '/user',
    component: () => require('../layouts/UserLayout'),
  }
}
