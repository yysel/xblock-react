import logo from '../assets/logo.png'

const initState = {
  logo: '',
  title: 'x-block 只为快捷开发',
  favicon: logo
}
export default {
  namespace: '@@app',
  state: initState,
  effects: {},
  reducers: {
    save (state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
