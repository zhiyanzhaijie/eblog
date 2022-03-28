import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteForm = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 白名单？ 放行 ：继续审核
  if (whiteForm.includes(to.path)) {
    next()
  } else {
    // Token? 继续审核：跳至login
    const hasToken = store.getters.Token
    if (hasToken) {
      const userId = store.getters.userId
      const userInfo = store.getters.userInfo
      const routes = store.getters.routes
      // 在线？放行 ：继续审核
      if (userInfo.userId && routes.length) {
        next()
      } else {
        try {
          await store.dispatch('SET_USERINFO', userId) // 存储用户信息
          const asyncRoutes = await store.dispatch('SET_ROUTES') // 存储动态路由
          await asyncRoutes.forEach((route) => {
            router.addRoute('Main', route)
          }) // 载入子路由
          next({ ...to, replace: true })
        } catch (e) {
          console.log(e)
          next('/login')
          await store.dispatch('USER_LOGOUT')
        }
      }
    } else {
      // 无Token，调至登录页
      next('/login')
    }
  }
  NProgress.done()
})
router.afterEach(() => {
  NProgress.done()
})
