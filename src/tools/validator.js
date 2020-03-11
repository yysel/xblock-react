/**
 *  表单验证
 *  //定义表单规则
 var rule = [
 {name:"nickname", checkType : "string", checkRule:"1,3",  errorMsg:"姓名应为1-3个字符"},
 {name:"gender", checkType : "in", checkRule:['男','女'],  errorMsg:"请选择性别"},
 {name:"loves", checkType : "notnull", checkRule:"",  errorMsg:"请选择爱好"}
 ];
 var checkRes = graceChecker.check({
        nickname:'斯蒂芬',
        gender:'男',
        loves:'打代码'
    }, rule);
 if(checkRes){
        console.log('验证通过')
    }
 */
export const graceChecker = {
  error: '',
  check: function (data, rule) {
    for (let i = 0; i < rule.length; i++) {
      if (!rule[i].checkType) {
        return true
      }
      if (!rule[i].name) {
        return true
      }
      if (!rule[i].errorMsg) {
        return true
      }
      if (!data[rule[i].name]) {
        this.error = rule[i].errorMsg
        return false
      }
      switch (rule[i].checkType) {
        case 'string': {
          let reg = new RegExp('^.{' + rule[i].checkRule + '}$')
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }
        case 'int': {
          let reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$')
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'between': {
          if (!this.isNumber(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          let minMax = rule[i].checkRule.split(',')
          minMax[0] = Number(minMax[0])
          minMax[1] = Number(minMax[1])
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'betweenD': {
          let reg = /^-?[1-9][0-9]?$/
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          let minMax = rule[i].checkRule.split(',')
          minMax[0] = Number(minMax[0])
          minMax[1] = Number(minMax[1])
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'betweenF': {
          let reg = /^-?[0-9][0-9]?.+[0-9]+$/
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          let minMax = rule[i].checkRule.split(',')
          minMax[0] = Number(minMax[0])
          minMax[1] = Number(minMax[1])
          if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'same': {
          if (data[rule[i].name] != rule[i].checkRule) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'notsame': {
          if (data[rule[i].name] == rule[i].checkRule) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'email': {
          let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'phoneno': {
          let reg = /^1[0-9]{10,10}$/
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'zipcode': {
          let reg = /^[0-9]{6}$/
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'reg': {
          let reg = new RegExp(rule[i].checkRule)
          if (!reg.test(data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'in': {
          if (!rule[i].checkRule.some(row => row === data[rule[i].name])) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }

        case 'notnull': {
          if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
            this.error = rule[i].errorMsg
            return false
          }
          break
        }
      }
    }
    return true
  },
  isNumber: function (checkVal) {
    let reg = /^-?[1-9][0-9]?.?[0-9]*$/
    return reg.test(checkVal)
  },
}

export const FormRules = function (header) {
  const type = {
    number: '数字',
    string: '字符串',
    email: '邮箱',
    phone: '手机号',
    url: '网址',
  }
  const rules = [{
    required: header.require, message: header.message ? header.message : `请填写${header.title}`,
  }]
  if (header.value_type !== 'normal') rules.push({
    type: header.value_type,
    message: `该项必须是${type[header.value_type]}类型；`,
  })
  return rules
}
