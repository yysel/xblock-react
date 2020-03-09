import logo from '../assets/logo.png'

const initState = {
  logo: logo,
  title: 'x-block 只为快捷开发'
}
export default {
  namespace: '@@app',
  state: initState,
  effects: {
    * exportBlock ({payload, block, blockName, path}, {call}) {
      const response = yield call(exportBlock, {payload, block, path})
    },
  },
  reducers: {
    saveBlock (state, {data, index}) {
      let block = {}
      block[index] = data
      return {
        ...state,
        blockData: {...state.blockData, ...block},
      }
    },
  },
}
