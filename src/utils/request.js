import axios from 'axios'
import store from '@/store'
import { Notification } from 'element-ui'

const baseURL = '/admin'
const instance = axios.create({
  baseURL,
  timeout: 5000,
})
// 拦截器
// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 请求携带Token
    if (store.getters.Token) {
      config.headers.authorization = store.getters.Token
    }
    return config
  },
  (error) => {
    Notification.error({
      title: '错误',
      message: JSON.parse(error.response.data.data) || error.response,
    })
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data
    //get类返回获取数据
    if (res.success) {
      return res
    }
    return Promise.reject(res.data)
  },
  (error) => {
    Notification.error({
      title: '错误',
      message: JSON.parse(error.response.data.data) || error.response,
    })
    return Promise.reject(error)
  }
)

export default instance
