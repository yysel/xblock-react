import { getLoginUser, getMenu, login, register, queryNotices, clearNotices, search } from '../api'
import { setToken } from '../tools/auth'
import { replace, push } from 'react-router-redux'
import { checkCode } from '../tools/response'

export default {
  namespace: '@@xblock',
  state: {
    collapsed: false,
    notices: [],
    mainLayoutMenu: [],
    menuBlock: {},
    webSocketStatus: false,
    menuPage: [],  // 获取各个模块
    searchResult: [],
    currentUser: {
      name: '未登录',
    },
  },

  effects: {

    * fetchNotices (_, {call, put}) {
      const res = yield call(queryNotices)
      if (res?.success && res?.data)
        yield put({
          type: 'saveNotices',
          payload: res.data,
        })
    },

    * clearNotices ({payload}, {put, call}) {
      yield call(clearNotices, payload)
      const res = yield call(queryNotices)
      if (res?.success && res?.data)
        yield put({
          type: 'saveNotices',
          payload: res.data,
        })
    },

    * fetchMenu ({payload = true, callback, no_module = false}, {call, put}) {
      const res = yield call(getMenu, {dynamic: payload, no_module})
      if (res?.success) {
        yield put({
          type: 'saveMenu',
          payload: res.data,
        })
      }
      if (callback) {
        yield callback()
      }
    },

    * search ({payload}, {put, call}) {
      const response = yield call(search, payload)
      if (response?.success && response?.data)
        yield put({
          type: 'saveSearchResult',
          payload: response.data,
        })
    },

    * fetchCurrent (_, {call, put}) {
      const response = yield call(getLoginUser)
      if (response?.success) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        })
      }
    },

    * login ({payload, goPath}, {call, put}) {
      const response = yield call(login, payload)
      if (response?.success && response?.data) {
        yield setToken(response.data)
        const path = yield (goPath && goPath != 'index') ? '/' + goPath : '/'
        yield put(replace(path))
        if (window.connection) {
          yield window.connection.keepOnline()
        }
      }
      return response
    },

    * logout (_, {put, select}) {
      yield window.top.postMessage('logout', '*')
      const pathname = yield select(state => state.routing.location.pathname)
      let goPath = yield trim('/', pathname)
      yield goPath = goPath.replace(/user\/login/g, '')
      goPath = yield trim('/', goPath)
      if (['index', 'user/login/index'].indexOf(goPath) > -1) {
        yield goPath = 'index'
      }
      yield goPath = goPath ? goPath.replace(/\//g, '@') : 'index'
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      })
      yield setToken('')
      if (window.connection) {
        yield window.connection.stop()
      }
      yield put(replace(`/user/login/${goPath}`))
    },

    * logoutGoHome ({home}, {put, select}) {
      yield window.top.postMessage('logout', '*')
      let goPath = yield trim('/', home)
      yield goPath = goPath ? goPath.replace(/\//g, '@') : null
      yield setToken('')
      if (window.connection) {
        yield window.connection.stop()
      }
      yield put(replace(`/user/login/${goPath}`))
    },

    * register ({payload, goPath, callBack}, {call, put}) {
      const response = yield call(register, payload)
      yield  checkCode(response)
      if (response.code < 1000) {
        yield  callBack()
      }
    },
  },

  reducers: {
    saveMenu (state, {payload}) {
      return {
        ...state,
        mainLayoutMenu: payload,
      }
    },
    changeLayoutCollapsed (state, {payload}) {
      return {
        ...state,
        collapsed: payload,
      }
    },
    saveNotices (state, {payload}) {
      return {
        ...state,
        notices: payload,
      }
    },
    saveClearedNotices (state, {payload}) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      }
    },

    clearMenu (state) {
      return {
        ...state,
        menuData: [],
        menuBlock: {},
      }
    },
    wsClose (state) {
      return {
        ...state,
        webSocketStatus: false,
      }
    },
    wsOpen (state) {
      return {
        ...state,
        webSocketStatus: true,
      }
    },
    save (state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    saveSearchResult (state, {payload}) {
      return {
        ...state,
        searchResult: payload,
      }
    },
    saveCurrentUser (state, action) {
      return {
        ...state,
        currentUser: action.payload,
      }
    },
    changeNotifyCount (state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      }
    },
  },

  subscriptions: {
    setup ({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search)
        }
      })
    },
  },
}
