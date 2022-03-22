import request from '@/utils/request'
const URL = {
  province: '/province',
  city: '/city',
  area: '/area',
}
// 省份信息接口
export function getProvinceId() {
  return request({
    url: URL.province,
    method: 'get',
  })
}
// 城市信息接口
export function getCityId(id) {
  return request({
    url: `${URL.city}/${id}`,
    method: 'get',
  })
}
// 区县信息接口
export function getAreaId(id) {
  return request({
    url: `${URL.area}/${id}`,
    method: 'get',
  })
}
