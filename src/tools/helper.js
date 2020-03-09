//用一个对象对应的值,替换字符串中{}包裹的值
import Url from 'url'
import * as routerRedux from 'react-router-redux'
import registerState from '../xblock/registerState'

export const color = [

  //===6
  '#f5222d',
  '#faad14',
  '#52c41a',
  '#2f54eb',

  '#fa541c',
  '#fadb14',
  '#13c2c2',
  '#722ed1',

  '#fa8c16',
  '#a0d911',
  '#1890ff',
  '#eb2f96',

  //===5
  '#ff4d4f',
  '#ffc53d',
  '#73d13d',
  '#597ef7',

  '#ff7a45',
  '#ffec3d',
  '#36cfc9',
  '#9254de',

  '#ffa940',
  '#bae637',
  '#40a9ff',
  '#f759ab',

  //===4
  '#ff7875',
  '#ffd666',
  '#95de64',
  '#85a5ff',

  '#ff9c6e',
  '#fff566',
  '#5cdbd3',
  '#b37feb',

  '#ffc069',
  '#d3f261',
  '#69c0ff',
  '#ff85c0',

  //===3

  '#ffa39e',
  '#ffe58f',
  '#b7eb8f',
  '#adc6ff',

  '#ffbb96',
  '#fffb8f',
  '#87e8de',
  '#d3adf7',

  '#ffd591',
  '#eaff8f',
  '#91d5ff',
  '#ffadd2',

]

export function parseString (string = '', value = {}) {
  const substr = string.match(/{(\S*)}/)
  return substr ? string.replace(substr[0], value[substr[1]]) : string
}

export function find (str, c, n) {
  let x = str.indexOf(c)
  for (let i = 0; i < n; i++) {
    x = str.indexOf(c, x + 1)
  }
  return x
}

//查找级联中所有的父级节点
export function findParent (value, dict, all = []) {
  all.unshift(value)
  const _self = dict.find(item => item.value == value)
  if (_self && _self.parent) {
    findParent(_self.parent, dict, all)
  }
  return false
}

/***
 * 格式化表头为级联树
 * @param dict 字典结构
 * @param parent
 * @returns {*}
 */
export function getDictTree (dict, parent = null, disabled = []) {
  return dict.filter(i => parent ? i.parent === parent : !i.parent).map(i => ({
    ...i,
    title: i.text,
    children: getDictTree(dict, i.value, disabled),
    disabled: disabled?.length ? disabled.includes(i.value) : false,
  }))
}

//清除对象中的无效值（undefined,null）
export function clear (object) {
  const res = {}
  for (let key in object) {
    const value = object[key]
    if (value != null) {
      res[key] = value
    }
  }
  return res
}

//深度克隆
export function deepClone (obj) {
  const result = JSON.parse(JSON.stringify(obj))
  return result
}

//解析路由中的参数
export function parseUrl (url, value) {
  const newUrl = parseString(url, value)
  const {pathname, query: parameter} = Url.parse(newUrl, true)
  return {pathname, parameter}
}

//兼容模式进入全屏
export function inFullScreen () {
  const de = document.documentElement
  if (de.requestFullscreen) {
    de.requestFullscreen()
  } else if (de.mozRequestFullScreen) {
    de.mozRequestFullScreen()
  } else if (de.webkitRequestFullScreen) {
    de.webkitRequestFullScreen()
  }
}

//路由跳转函数，transform为true时将变量参数转化到pathname去
/***
 *
 * @param path
 * @param query
 * @param transform
 * @param blank
 * @param otherQuery
 * @returns {*}
 */
export const goPage = function (path, query = {}, transform = false, blank = false, otherQuery = {}) {

  const newPath = blank ? `/blank/${path}` : path
  if (transform) {
    const {pathname, parameter} = parseUrl(newPath, query)
    return registerState.dispatch(routerRedux.push({pathname, parameter, refresh: true}))
  }
  return registerState.dispatch(routerRedux.push({pathname: newPath, parameter: query, refresh: true, ...otherQuery}))
}

//获取路由参数
export const getUrlQuery = (key, $default) => {
  const httpUrl = window.location.search
  const query = Url.parse(httpUrl, true).query
  if (key) {
    return query?.[key] ? query[key] : $default
  } else return query
}

//从表头字典格式化字段的值
export const getTextFromHeader = function (value, headerItem = []) {
  if (value instanceof Array) {
    const text = value.map(item => {
      if (item instanceof Object) return item.text ? item.text : '-'
      const column = headerItem.find(i => i.value === item)?.text
      return column ? column : item
    })
    return text.join('、')
  } else if (value instanceof Object) {
    return value.text ? value.text : ' - '
  } else {
    if (headerItem && headerItem instanceof Array && headerItem.length > 0) {
      const column = headerItem.find(i => i.value == value)
      return column ? column.text : value
    }
    return value
  }
}




