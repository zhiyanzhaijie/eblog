import { get_routes } from '@/api/route'
import { SET_ROUTES, REMOVE_ROUTES } from './constants'
import router from '@/router'
import { toTree } from '@/utils'
const actions = {
  [SET_ROUTES]({ commit }) {
    return new Promise((resolve, reject) =>
      get_routes()
        .then(async (res) => {
          // 路由转树形
          const routesTree = toTree(res.data, 0)

          // 过滤路由使之符合vue路由规矩
          const asyncRoutes = routerFilter(routesTree)
          // 动态路由添加到路由系统
          // await commit(SET_ROUTES, routes)
          // Main 路由下的子路由
          const staticRoutes = router.options.routes[2].children
          const allRoutes = [...staticRoutes, ...asyncRoutes]
          await commit(SET_ROUTES, allRoutes)
          resolve(asyncRoutes)
        })
        .catch((e) => {
          reject(e)
        })
    )
  },
  [REMOVE_ROUTES]({ commit }) {
    commit(REMOVE_ROUTES)
  },
}
const routerView = {
  render: (h) => h('router-view'),
}
// 路由过滤器
function routerFilter(routes) {
  const asyncRoutes = []
  routes.forEach((route) => {
    route.meta = {
      menu: route.menuName || '',
      icon: route.icon,
    }
    route.hidden = route.hide === 1 ? true : false
    route.props = route.props === 1 ? true : false
    // 父级路由
    if (!route.component) {
      route.component = routerView
      // 递归过滤子路由
      if (route?.children?.length) {
        route.children = routerFilter(route.children)
      }
    } else {
      try {
        route.component = require(`@/views/${route.component}`).default
      } catch (e) {
        console.log(e)
      }
    }
    asyncRoutes.push(route)
  })
  return asyncRoutes
}

export default actions
