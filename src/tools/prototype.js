import * as Type from './type';

export default function() {

  Object.prototype.map = function(func) {
    return Object.keys(this).map(k => func(this[k], k));
  };

  String.prototype.isFunction = Object.prototype.isFunction = function() {
    return Type.isFunction(this);
  };
  Object.prototype.isObject = function() {
    return Type.isObject(this);
  };
  Object.prototype.isArray = function() {
    return Type.isArray(this);
  };
  Object.prototype.isBoolean = function() {
    return Type.isBoolean(this);
  };
  Object.prototype.isEmpty = function() {
    return Type.isEmpty(this);
  };
  Object.prototype.isNull = function() {
    return Type.isNull(this);
  };
  Object.prototype.isNumber = function() {
    return Type.isNumber(this);
  };
  Object.prototype.isRegExp = function() {
    return Type.isRegExp(this);
  };
  Object.prototype.isString = function() {
    return Type.isString(this);
  };
  Object.prototype.isSymbol = function() {
    return Type.isSymbol(this);
  };
  Object.prototype.isUndefined = function() {
    return Type.isUndefined(this);
  };
  Object.prototype.getType = function() {
    return Type.getType(this);
  };
}

