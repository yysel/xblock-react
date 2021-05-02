import {getBlock, exportBlock, importBlock} from '../api'
import {checkCode} from '_tools/response'
import * as routerRedux from 'react-router-redux'

const initState = {
  blockData: {},
  loading: {},
  addFormVisible: {},
  editFormVisible: {},
  editFormValue: {},
  commonFormVisible: {},
  commonFormButton: {},
  commonFormValue: {},
  blockSetting: JSON.parse(window.localStorage.getItem('blockSetting')) ?? {},
  selectedValue: {}
}
export default {
  namespace: '@@container',
  state: initState,
  effects: {
    * getBlock({payload, action, block, path}, {call, put}) {
      if (action === 'list') yield put({type: 'startLoading', block})
      const response = yield call(getBlock, {payload, action, block, path})
      if (response) {
        yield checkCode(response)
        if (action === 'list' && response?.success && response?.data) {
          yield put({type: 'saveBlock', data: response.data, index: block})
        }
        if (response.redirect) {
          yield put(routerRedux.push({
            pathname: response.redirect, parameter: response.query,
            refresh: response.refresh,
          }))
        }
      }
      if (action === 'list') yield put({type: 'stopLoading', block})
      return response
    },
    * exportBlock({payload, block, blockName, path}, {call}) {
      const response = yield call(exportBlock, {payload, block, path})
      return response
    },
    * importBlock({payload, block, blockName, path}, {call}) {
      const response = yield call(importBlock, {payload, block, path})
      return response
    },
  },
  reducers: {
    saveBlock(state, {data, index}) {
      let block = {}
      block[index] = data
      dd(data.selectedValue,1111111);
      return data? {
        ...state,
        blockData: {...state.blockData, ...block},
      } : state
    },
    startLoading(state, {block}) {
      let loading = {...state.loading}
      loading[block] = true
      return {
        ...state,
        loading: {...loading},
      }
    },
    stopLoading(state, {block}) {
      let loading = {...state.loading}
      loading[block] = false
      return {
        ...state,
        loading: {...loading},
      }
    },
    changeAddFormVisible(state, {status, index}) {
      let addFormVisible = {...state.addFormVisible}
      addFormVisible[index] = status
      return {
        ...state,
        addFormVisible: {...addFormVisible},
      }
    },

    changeCommonFormVisible(state, {status, index, button, value = {}}) {
      let commonFormVisible = {...state.commonFormVisible}
      commonFormVisible[index] = status
      return {
        ...state,
        commonFormButton: button,
        commonFormVisible: {...commonFormVisible},
        commonFormValue: value
      }
    },
    saveHeaderShow(state, {value, index}) {
      const obj = {}
      obj[index] = value;
      const blockSetting = {...state.blockSetting, ...obj}
      const newState = {...state, blockSetting}
      window.localStorage.setItem('blockSetting', JSON.stringify(blockSetting))
      return newState
    },
    saveSelectedValue(state, {value, index}) {
      const obj = {}
      obj[index] = value;
      const selectedValue = {...state.selectedValue, ...obj}
      return {...state, selectedValue}
    },

    changeEditFormVisible(state, {status, index, value}) {
      let editFormVisible = {...state.editFormVisible}
      editFormVisible[index] = status
      return {
        ...state,
        editFormVisible: {...editFormVisible},
        editFormValue: value,
      }
    },
  },
}
