import request from '@/utils/request'
const URL = {
  captcha: '/captcha',
  register: '/register',
  login: '/login',
  userInfo: '/userInfo',
}
// 二维码接口
export function getCaptcha() {
  return request({
    url: URL.captcha,
    method: 'get',
  })
}
// 登录接口
export function userLogin(data) {
  return request({
    url: URL.login,
    method: 'post',
    data,
  })
}
// 注册接口
export function userRegister(data) {
  return request({
    url: URL.register,
    method: 'post',
    data,
  })
}
// 获取用户信息接口
export function getUserInfo(id) {
  return request({
    url: `${URL.userInfo}/${id}`,
    method: 'get',
  })
}

// 更新用户信息接口
export function updateUserInfo(id, data) {
  return request({
    url: `${URL.userInfo}/${id}`,
    method: 'put',
    data,
  })
}
