import { getBlock, exportBlock, importBlock } from '../api'
import { checkCode } from '_tools/response'
import * as routerRedux from 'react-router-redux'

const initState = {
  blockData: {},
  loading: {},
  addFormVisible: {},
  editFormVisible: {},
  editFormValue: {},
  commonFormVisible: {},
  commonFormButton: {},
}
export default {
  namespace: '@@container',
  state: initState,
  effects: {
    * getBlock ({payload, action, block, path}, {call, put}) {
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
    * exportBlock ({payload, block, blockName, path}, {call}) {
      const response = yield call(exportBlock, {payload, block, path})
      return response
    },
    * importBlock ({payload, block, blockName, path}, {call}) {
      const response = yield call(importBlock, {payload, block, path})
      return response
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
    startLoading (state, {block}) {
      let loading = {...state.loading}
      loading[block] = true
      return {
        ...state,
        loading: {...loading},
      }
    },
    stopLoading (state, {block}) {
      let loading = {...state.loading}
      loading[block] = false
      return {
        ...state,
        loading: {...loading},
      }
    },
    changeAddFormVisible (state, {status, index}) {
      let addFormVisible = {...state.addFormVisible}
      addFormVisible[index] = status
      return {
        ...state,
        addFormVisible: {...addFormVisible},
      }
    },

    changeCommonFormVisible (state, {status, index, button}) {
      let commonFormVisible = {...state.commonFormVisible}
      commonFormVisible[index] = status
      return {
        ...state,
        commonFormButton: button,
        commonFormVisible: {...commonFormVisible},
      }
    },

    changeEditFormVisible (state, {status, index, value}) {
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
