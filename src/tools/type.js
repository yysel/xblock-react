const toString = (value) => Object.prototype.toString.call(value);

/**
 * 判断类型Null
 * @param {any} value
 */
export const isNull = value => toString(value) === '[object Null]';

/**
 * 判断类型Undefined
 * @param {any} value
 */
export const isUndefined = value => value === void 0;

/**
 * 判断类型Boolean
 * @param {any} value
 */
export const isBoolean = value => typeof(value) === 'boolean';

/**
 * 判断类型Number
 * @param {any} value
 */
export const isNumber = value => typeof(value) === 'number';

/**
 * 判断类型String
 * @param {any} value
 */
export const isString = value => typeof(value) === 'string';

/**
 * 判断类型Symbol
 * @param {any} value
 */
export const isSymbol = value => toString(value) === '[object Symbol]';

/**
 * 判断类型Object
 * @param {any} value
 */
export const isObject = value => toString(value) === '[object Object]';

/**
 * 判断类型RegExp
 * @param {any} value
 */
export const isRegExp = value => toString(value) === '[object RegExp]';

/**
 * 判断类型Array
 * @param {any} value
 */
export const isArray = value => toString(value) === '[object Array]';

/**
 * 判断类型Function
 * @param {any} value
 */
export const isFunction = value => toString(value) === '[object Function]';

/**
 * 获取数据类型
 * @param {any} value
 * @example utilscore.getType(null) // => "null"
 */
export const getType = (value) => toString(value).match(/\s([a-z]+)/i)[1].toLocaleLowerCase();

/**
 * 判断元素是否为空
 * @param {any} value
 */
export const isEmpty = (value) => {
  if (value === void(0) || value === null) return true;
  else if (isObject(value)) return !Object.keys(value).length;
  else if (isArray(value)) return !value.length;
  else if (isString(value)) return !value;
  else return value.toString().length == 0;
};


/**
 * 递归比较两个对象是否一致
 * @param x
 * @param y
 * @returns {boolean}
 */
export const objectCompare = function(x, y) {
  if (x === y) {
    return true;
  }
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }
  for (let p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      if (x[p] === y[p]) {
        continue;
      }
      if (typeof (x[p]) !== 'object') {
        return false;
      }
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }
  for (let p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
};
