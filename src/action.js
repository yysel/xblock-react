import registerState from './xblock/registerState'

export default function getAction (dispatch) {
  let thisDispatch = registerState.dispatch
  if (dispatch) thisDispatch = dispatch
  return {
    //获取block
    getBlock: (block, action, payload = {}, path) => thisDispatch({
      type: '@@container/getBlock',
      block,
      action,
      payload,
      path,
    }),
    exportBlock: (block, payload = {}, path) => thisDispatch({
      type: '@@container/exportBlock',
      block,
      payload,
      path,
    }),

    importBlock: (block, payload = {}, path) => thisDispatch({
      type: '@@container/importBlock',
      block,
      payload,
      path,
    }),
    //登录
    login: (payload = {}) => thisDispatch({
      type: '@@xblock/login',
      ...payload,
    }),

    register: (payload = {}) => thisDispatch({
      type: '@@xblock/register',
      ...payload,
    }),

    //登出用户
    logout: () => thisDispatch({
      type: '@@xblock/logout',
    }),

    //获取当前用户
    getUser: () => thisDispatch({
      type: '@@xblock/fetchCurrent',
    }),

    //获取菜单
    getMenu: (payload = {}) => {
      return thisDispatch({
        type: '@@xblock/fetchMenu',
        ...payload,
      })
    },

    //改变新增表单的显隐状态
    changeAddFormVisible: (index, status) => thisDispatch({
      type: '@@container/changeAddFormVisible',
      status,
      index,
    }),

    changeCommonFormVisible: (index, status, button,value) => thisDispatch({
      type: '@@container/changeCommonFormVisible',
      status,
      index,
      button,
      value
    }),

    /**
     * //改变编辑表单的显隐状态
     * @param index
     * @param status
     * @param value
     * @returns {*}
     */
    changeEditFormVisible: (index, status, value = {}) => thisDispatch({
      type: '@@container/changeEditFormVisible',
      status,
      index,
      value,
    }),

    changeLayoutCollapsed: (payload = {}) => thisDispatch({
      type: '@@xblock/changeLayoutCollapsed',
      ...payload,
    }),
    clearNotices: (payload = {}) => thisDispatch({
      type: '@@xblock/clearNotices',
      ...payload,
    }),
    logoutGoHome: (payload = {}) => thisDispatch({
      type: '@@xblock/logoutGoHome',
      ...payload,
    }),
    clearMenu: (payload = {}) => thisDispatch({
      type: '@@xblock/clearMenu',
      ...payload,
    }),
    fetchNotices: (payload = {}) => thisDispatch({
      type: '@@xblock/fetchNotices',
      ...payload,
    })
  }
}



