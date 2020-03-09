/**
 * 在客户端触发文件下载
 * @param {string} fileName
 * @param {Blob | File | String | any[]} content
 * @param {?:String} type
 * @returns {void}
 */
export function downloadFile(blob, fileName) {
  let el = document.createElement('a');
  el.href = window.URL.createObjectURL(blob);
  el.download = fileName;
  el.addEventListener('click', e => e.stopImmediatePropagation());
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

/**
 * 将文本数据放置在剪贴板上
 * @param {String} value
 */
export const setClipboardData = (value) => {
  let aux = document.createElement('input');
  aux.setAttribute('value', value);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document.body.removeChild(aux);
};

/**
 * 从url中下载数据
 * @param {string} url
 * @param {string} fileName
 * @example download('www.xxx.com/a.png','图片')
 */
export function download(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  document.removeChild(a);
}

export function getFileType(file) {
  return file?.split('.')?.[file.split('.').length - 1];
}
