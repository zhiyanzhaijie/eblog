import storage from 'store'

// 保存和获取token
export function setToken(Token) {
  storage.set('Token', Token)
}
export function getToken() {
  return storage.get('Token')
}
export function removeToken() {
  storage.remove('Token')
}

// 保存和获取userId
export function setUserId(id) {
  storage.set('userId', id)
}
export function getUserId() {
  return storage.get('userId')
}
export function removeUserid() {
  storage.remove('userId')
}
