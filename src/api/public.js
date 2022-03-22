import request from '@/utils/request'
const URL = {
  province: '/province',
  city: '/city',
  area: '/area',
  uploadImg: '/upload/img',
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

// 上传图片接口
export function uploadImg(formData) {
  return request({
    ulr: URL.uploadImg,
    method: 'post',
    formData,
  })
}
