import request from '@/utils/request'
const url = '/user'
// 查询用户列表接口
export function get_userList(query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: query,
  })
}
// 查询单个角色接口
export function get_user(id) {
  return request({
    url: `${url}/${id}`,
    method: 'get',
  })
}
// 添加角色接口
export function add_user(data) {
  return request({
    url: `${url}`,
    method: 'post',
    data,
  })
}
// 销毁角色接口
export function remove_user(id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete',
  })
}
// 更新单个角色接口
export function update_user(id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data,
  })
}
