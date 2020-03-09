export const trim = (str, s = ' ') => {
  if (str.substr(0, 1) == s) return str.substr(1);
  return str;
};
