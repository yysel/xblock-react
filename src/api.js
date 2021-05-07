import {request, download, upload} from './fetch'

export async function getLoginUser() {
  return request('/api/xblock/auth/user')
}

export async function queryNotices() {
  return request('/api/xblock/notification', {
    method: 'POST',
  });
}

export async function clearNotices(params) {
  return request('/api/xblock/notification/clear', {
    method: 'POST',
    body: params,
  });
}

export async function getMenu(params) {
  return request('/api/xblock/menu', {
    method: 'POST',
    body: params,
  })
}

export async function login(params) {
  return request('/api/xblock/auth/login', {
    method: 'POST',
    body: params,
  })
}

export async function register(params) {
  return request('/api/xblock/auth/register', {
    method: 'POST',
    body: params,
  })
}

export async function importBlock({block, payload, path}) {
  return upload(`/api/xblock/${block}/import`, payload, {Location: path})
}

export async function exportBlock({block, payload = {}, path}) {
  return download(`/api/xblock/${block}/export`, {
    method: 'POST',
    body: payload,
    headers: {
      Location: path,
    },
  })
}

export async function getBlock({block, action = 'list', payload = {}, path}) {
  return request(`/api/xblock/${block}/${action}`, {
    method: 'POST',
    body: payload,
    headers: {
      Location: path,
    },
  })
}


