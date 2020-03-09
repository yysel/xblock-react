import { request, download, uploadFile } from './fetch';

export async function getLoginUser() {
  return request('/api/xblock/auth/user');
}


export async function getMenu(params) {
  return request('/api/xblock/menu', {
    method: 'POST',
    body: params,
  });
}

export async function login(params) {
  return request('/api/xblock/auth/login', {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request('/api/xblock/auth/register', {
    method: 'POST',
    body: params,
  });
}

export async function search(title) {
  return request(`/api/search?keyword=${title}`);
}


export async function queryNotices() {
  return request('/api/xblock/notification', {
    method: 'POST',
  });
}

export async function clearNotices(params) {
  return request('/api/system/notification/clear', {
    method: 'POST',
    body: params,
  });
}


export async function getExportTemplateUrl(block) {
  return request(`/api/system/import/template/url/${block}`, {
    method: 'POST',
  });
}

export async function importBlock({ block, file }) {
  return uploadFile(`/api/system/import/${block}`, { file });
}

export async function uploadBlock({ block, action = 'list', payload = {} }) {
  return uploadFile(`/api/get-block/${action}`, { block, ...payload });
}


export async function Backup(params) {
  return download(`/api/blocks/backup`, {
    method: 'POST',
    body: params,
  });
}

export async function exportBlock({ block, payload = {}, path }) {
  return download(`/api/xblock/${block}/export`, {
    method: 'POST',
    body: { block, ...payload },
    headers: {
      Location: path,
    },
  });
}

export async function getBlock({ block, action = 'list', payload = {}, path }) {
  return request(`/api/xblock/${block}/${action}`, {
    method: 'POST',
    body: payload,
    headers: {
      Location: path,
    },
  });
}


