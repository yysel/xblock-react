import fetchData from 'dva/fetch'
import { getToken } from './tools/auth'
import { Modal, Divider } from 'antd'
import registerState from './xblock/registerState'
import { downloadFile } from './tools/file'

export default class Fetch {

  static headers = {}

  static after () {

  }

  static before (response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    }
    const codeMessage = {
      200: '服务器成功返回请求的数据。',
      201: '新建或修改数据成功。',
      202: '一个请求已经进入后台排队（异步任务）。',
      204: '删除数据成功。',
      400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
      401: '用户没有权限（令牌、用户名、密码错误）。',
      403: '用户得到授权，但是访问是被禁止的。',
      404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
      406: '请求的格式不可得。',
      410: '请求的资源被永久删除，且不会再得到的。',
      422: '当创建一个对象时，发生一个验证错误。',
      500: '服务器发生错误，请检查服务器。',
      502: '网关错误。',
      503: '服务不可用，服务器暂时过载或维护。',
      504: '网关超时。',
    }
    const errorText = codeMessage[response.status] || response.statusText
    const error = new Error(errorText)
    error.status = response.status
    error.info = errorText
    error.response = response
    throw error
  }

  static getToken () {
    return getToken()
  }

  static getOptions (options) {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Client-Type': 'web-admin',
        'Location': registerState.getState('routing')?.location?.pathname,
        'Authorization': `Bearer ${Fetch.getToken()}`,
      },
    }
    const newOptions = {
      ...defaultOptions, ...options,
      headers: {...defaultOptions.headers, ...Fetch.headers, ...options?.headers}
    }
    if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'GET') {
      if (!(newOptions.body instanceof FormData)) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          ...newOptions.headers,
        }
        newOptions.body = JSON.stringify({...newOptions.body})
      } else {
        // newOptions.body is FormData
        newOptions.headers = {
          Accept: 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          ...newOptions.headers,
        }
      }
    }
    return newOptions
  }

  static fetch (url, options) {
    const newOptions = Fetch.getOptions(options)
    return fetchData(url, newOptions)
  }

  static request (url, options) {
    return Fetch.fetch(url, options)
      .then(Fetch.before)
      .then(response => {
        if ((options && options.method === 'DELETE') || response.status === 204) {
          return response.text()
        }
        return response.json()
      }).then((res) => {
        const result = Fetch.after(res)
        return result ? result : res
      })
      .catch(e => {
        if (DEV && e?.response && e.status !== 504) {
          e?.response?.json()?.then(error => {
            Modal.error({
              title: e?.info,
              width: 1000,
              content: <div>
                <p>错误文件：{error?.file} </p>
                <p>错误行号：{error?.line}</p>
                {error?.message && <p><Divider/><p>{error?.message}</p></p>}
              </div>,
            })
          })
        }
      })
  }

  static download (url, options) {
    return Fetch.fetch(url, options)
      .then(response => {
        const filenameArray = response.headers.get('content-disposition').split(';')
        let filename
        if (filenameArray.length === 3) {
          filename = decodeURI(filenameArray[2].split('filename*=utf-8\'\'')[1])
        } else {
          filename = filenameArray[1].split('filename=')[1]
        }
        return {
          filename,
          blob: response.blob(),
        }
      }).then(({blob, filename}) => blob.then((b) => downloadFile(b, options?.filename ? options?.filename : filename)))
      .catch(e => {
        console.log(e)
      })
  }

  static proxy (url, params) {
    return request('/api/system/proxy', {
      body: {
        ...params.body,
        url,
        method: params.method ? params.method : 'post',
      },
      method: 'POST',
    })
  }

  static uploadFile (url, params) {

    let formData = new FormData()
    for (let key in params) {
      formData.append(key, params[key])
    }
    return fetch(url, {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((responseData) => {
        console.log('uploadImage', responseData)
        return responseData
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

}
export const request = Fetch.request
export const uploadFile = Fetch.uploadFile
export const download = Fetch.download
export const proxy = Fetch.proxy
