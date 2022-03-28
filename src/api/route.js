import request from '@/utils/request'
// 获取权限路由接口
const url = '/route'
export function get_routes() {
  return request({
    url: `${url}`,
    method: 'get',
  })
}
