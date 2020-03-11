import registerState from './xblock/registerState'

//获取block
export const getBlock = (block, action, payload = {}, path) => registerState.dispatch({
  type: '@@container/getBlock',
  block,
  action,
  payload,
  path,
})
export const exportBlock = (block, payload = {}, path) => registerState.dispatch({
  type: '@@container/exportBlock',
  block,
  payload,
  path,
})
//登录
export const login = (payload = {}) => registerState.dispatch({
  type: '@@xblock/login',
  ...payload,
})

export const register = (payload = {}) => registerState.dispatch({
  type: '@@xblock/register',
  ...payload,
})

//登出用户
export const logout = () => registerState.dispatch({
  type: '@@xblock/logout',
})

//获取当前用户
export const getUser = () => registerState.dispatch({
  type: '@@xblock/fetchCurrent',
})

//获取菜单
export const getMenu = (payload = {}) =>{
 return registerState.dispatch({
    type: '@@xblock/fetchMenu',
    ...payload,
  })
}

//改变新增表单的显隐状态
export const changeAddFormVisible = (index, status) => registerState.dispatch({
  type: '@@container/changeAddFormVisible',
  status,
  index,
})

/**
 * //改变编辑表单的显隐状态
 * @param index
 * @param status
 * @param value
 * @returns {*}
 */
export const changeEditFormVisible = (index, status, value = {}) => registerState.dispatch({
  type: '@@container/changeEditFormVisible',
  status,
  index,
  value,
})

export const changeLayoutCollapsed = (payload = {}) => registerState.dispatch({
  type: '@@xblock/changeLayoutCollapsed',
  ...payload,
})
export const clearNotices = (payload = {}) => registerState.dispatch({
  type: '@@xblock/clearNotices',
  ...payload,
})
export const logoutGoHome = (payload = {}) => registerState.dispatch({
  type: '@@xblock/logoutGoHome',
  ...payload,
})
export const clearMenu = (payload = {}) => registerState.dispatch({
  type: '@@xblock/clearMenu',
  ...payload,
})
export const fetchNotices = (payload = {}) => registerState.dispatch({
  type: '@@xblock/fetchNotices',
  ...payload,
})



