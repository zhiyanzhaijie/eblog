import request from '@/utils/request'
const url = '/category'
// 查询分类列表接口
export function category_list(query) {
  return request({
    url: `${url}`,
    method: 'get',
    params: query,
  })
}

// 新增分类接口
export function category_create(data) {
  return request({
    url: `${url}`,
    method: 'post',
    data,
  })
}
// 编辑分类接口
export function category_put(id, data) {
  return request({
    url: `${url}/${id}`,
    method: 'put',
    data,
  })
}
// 删除分类接口
export function category_delete(id) {
  return request({
    url: `${url}/${id}`,
    method: 'delete',
  })
}
