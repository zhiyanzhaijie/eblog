import router from '@/router'
import store from '@/store'
const whiteForm = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  if (whiteForm.includes(to.path)) {
    next()
  } else {
    const hasToken = store.getters.Token
    if (hasToken) {
      // 判断Token是否与userInfo是否存在
      const userId = store.getters.userId
      const userInfo = store.getters.userInfo
      if (userInfo.userId) {
        next()
      } else {
        await store
          .dispatch('SET_USERINFO', userId)
          .then(() => {
            next()
          })
          .catch(() => {
            next('/login')
            store.dispatch('USER_LOGOUT')
          })
      }
      next()
    } else {
      next('/login')
      await store.dispatch('USER_LOGOUT')
    }
  }
})
