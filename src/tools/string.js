export const trim = (str, s = ' ') => {
  if (str.substr(0, 1) == s) return str.substr(1)
  return str
}

export const getStingLength = function (str) {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length
}
