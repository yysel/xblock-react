import url from 'url';

export function setToken(token) {
  return localStorage.setItem('token', token);
}

export function getToken() {
  const localToken = localStorage.getItem('token');
  const httpUrl = window.location.search;
  const urlToken = url.parse(httpUrl, true).query.token;
  const token = urlToken ? urlToken : localToken;
  return token || null;
}


export function checkAuthority(auth, list = [], passDom, refuseDom) {
  if (!auth) return passDom;
  else if (list?.length <= 0) return refuseDom;
  else return list.includes(auth) ? passDom : refuseDom;
}
