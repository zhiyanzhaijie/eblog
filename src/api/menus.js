import request from '@/utils/request'
const url = '/menu'
// 查询菜单列表接口
export function get_menuslist() {
  return request({
    url: `${url}`,
    method: 'get',
  })
}
// 查询菜单列表接口
export function get_menus(id) {
  return request({
    url: `${url}/${id}`,
    method: 'get',
  })
}
// 新增菜单接口
export function add_menus(data) {
  return request({
    url: `${url}`,
    method: 'post',
    data,
  })
}
// 编辑菜单接口
export function edit_menus(id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data,
  })
}
// 删除菜单接口
export function remove_menus(id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete',
  })
}

