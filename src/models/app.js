import logo from '../assets/logo.png'
import favicon from '../assets/favicon.png'

const initState = {
  logo,
  title: '只为快捷开发',
  favicon
}
export default {
  namespace: '@@app',
  state: initState,
  effects: {},
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
