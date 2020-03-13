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
  static dispatch = ({type}) => {
    console.log(`${type} 调用失败！dispatch未注册`)
  }
  static getState = () => {}
  static userLayout = {
    path: '/user',
    component: () => require('../layouts/UserLayout'),
  }
  static mainLayout = {
    path: '/',
    component: () => require('../layouts/MainLayout'),
  }
}
