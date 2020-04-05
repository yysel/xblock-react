import registerState from './registerState'

const map = function (func) {
  return Object.keys(this).map(k => func(this[k], k))
}

const registerArray = function (data, key) {
  if (!data) return
  if (data instanceof Array) registerState[key] = [...data, ...registerState[key]]
  else registerState[key] = registerState[key] = [data, ...registerState[key]]

}
const registerObject = (data, key) => {
  registerState[key] = {...registerState[key], ...data}
}

export default {

  blockConfig: (data) => {
    let object = data
    if (!(data instanceof Array)) {
      object = [data]
    }
    object.map(item => {
      if (item?.event) {
        item.event.map = map
        item.event.map((i, k) => item.event[k] = i.bind(item))
      }
      if (item?.button) {
        item.button.map = map
        item.button.map((i, k) => item.button[k] = i.bind(item))
      }
      if (item?.header) {
        item.header.map = map
        item.header.map((i, k) => item.header[k] = i.bind(item))
      }
      registerState.blockConfig[item.index] = item
    })
  },

  api: (data) => {
    registerObject(data, 'api')
  },
  config: (data) => {
    registerObject(data, 'config')
  },
  mainLayout:(data)=>{
    registerObject(data, 'mainLayout')
  },
  mainLayoutMount:(func)=>{registerState.mount=func},
  mainLayoutMounted:(func)=>{registerState.mounted=func},
  menu: (data) => {
    registerArray(data, 'menu')
  },
  router: (data) => {
    registerArray(data, 'router')
  },
  userRouter: (data) => {
    registerArray(data, 'userRouter')
  },
  layout: (data) => {
    registerArray(data, 'layout')
  },
  blockComponent: (data) => {
    registerArray(data, 'blockComponent')
  },
  button: (data) => {
    return registerArray(data, 'button')
  },

  input: (data) => {
    registerArray(data, 'input')
  },

  cell: (data) => {
    registerArray(data, 'cell')
  },

  getBlockConfig: (index, option = {}) => {
    const config = registerState.blockConfig[index] || {}
    option.map = map
    option.map((i, k) => config[k] = i)
    return config
  }
}
