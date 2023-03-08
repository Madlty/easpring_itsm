import { validUsername, validPhone, validEmail } from './validate'
/*验证手机号*/
export function checkPhone (rule, value, callback) {
  if (value != null && value != "") {
    if (!validPhone(value)) {
      callback(new Error('手机号码规则不正确',))
    } else {
      callback()
    }
  }
  else {
    callback(new Error('请输入手机号'));
  }
}
/*Email验证*/
export function checkemail (rule, value, callback) {
  if (value != null && value != "") {
    if (!validEmail(value)) {
      callback(new Error('Email格式不正确',))
    } else {
      callback()
    }
  }
  else {
    callback(new Error('请输入Email'));
  }
}

export default {
  phone: checkPhone,
  email: checkemail
}