//获取域名前缀
export const getTopDomain = (host = null) => {
  const main = host ? host : document.domain;
  const [h, ...rest] = main.split('.');
  return h;
};