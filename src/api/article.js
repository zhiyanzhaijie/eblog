import request from '@/utils/request'
const url = {
  article: '/article',
  all: '/article/all',
  audit: '/article/audit',
  publish: '/article/publish',
  toAudit: '/article/toAudit',
  showHome: '/article/showHome',
}
// 查询文章列表接口
export function article_list(query) {
  return request({
    url: url.article,
    method: 'get',
    params: query,
  })
}

// 查询单篇文章列表接口
export function article_show(id) {
  return request({
    url: `${url.article}/${id}`,
    method: 'get',
  })
}

// 新增文章接口
export function article_create(data) {
  return request({
    url: `${url.article}`,
    method: 'post',
    data,
  })
}
// 编辑文章接口
export function article_put(id, data) {
  return request({
    url: `${url.article}/${id}`,
    method: 'put',
    data,
  })
}
// 删除文章接口
export function article_delete(id) {
  return request({
    url: `${url.article}/${id}`,
    method: 'delete',
  })
}
// 申请审核文章接口
export function article_to_audit(id, data) {
  return request({
    url: `${url.toAudit}/${id}`,
    method: 'post',
    data,
  })
}

// 发布文章接口
export function article_publish(id, data) {
  return request({
    url: `${url.publish}/${id}`,
    method: 'post',
    data,
  })
}

// 管理员审核接口
export function article_audit(id, data) {
  return request({
    url: `${url.audit}/${id}`,
    method: 'post',
    data,
  })
}

// 管理员获取全部文章
export function article_list_all(query) {
  return request({
    url: url.all,
    method: 'get',
    params: query,
  })
}

// 管理员展示文章
export function article_showHome(id, data) {
  return request({
    url: `${url.showHome}/${id}`,
    method: 'post',
    data,
  })
}
