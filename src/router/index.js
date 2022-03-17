import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutBasic from '@/layouts/LayoutBasic' // 基本布局无需懒加载

const routerView = {
  render: (h) => h('router-view'),
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
  },
  {
    path: '/404',
    name: 'Error',
    component: () => import('@/views/sys/404'),
  },
  {
    path: '/',
    name: 'Main',
    redirect: '/dashboard',
    component: LayoutBasic,
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: {
          menu: '主页',
          icon: 'el-icon-s-home',
        },
        component: () => import('@/views/sys/dashboard'),
      },
      {
        path: '/category',
        name: 'Category',
        meta: {
          menu: '分类',
          icon: 'el-icon-folder-opened',
        },
        component: () => import('@/views/sys/category'),
      },
      {
        path: '/draft',
        name: 'Draft',
        meta: {
          menu: '草稿',
          icon: 'el-icon-edit-outline',
        },
        component: () => import('@/views/sys/draft'),
      },
      {
        path: '/audit',
        name: 'Audit',
        meta: {
          menu: '审核管理',
          icon: 'el-icon-s-management',
        },
        component: () => import('@/views/sys/audit'),
      },
      {
        path: '/articles',
        name: 'Articles',
        redirect: '/articles/list',
        meta: {
          menu: '文章管理',
          icon: 'el-icon-document-copy',
        },
        component: routerView,
        children: [
          {
            path: '/articles/list',
            name: 'ArticlesList',
            meta: {
              menu: '文章列表',
            },
            component: () => import('@/views/sys/articles'),
          },
          {
            path: '/articlts/edit',
            name: 'ArticlesEdit',
            meta: {
              menu: '编辑文章',
            },
            component: () => import('@/views/sys/articles/edit'),
          },
        ],
      },
      {
        path: '/user',
        name: 'User',
        meta: {
          menu: '权限管理',
          icon: 'el-icon-s-check',
        },
        component: () => import('@/views/sys/user'),
      },
      {
        path: '/roles',
        name: 'Roles',
        meta: {
          menu: '用户',
          icon: 'el-icon-s-custom',
        },
        component: () => import('@/views/sys/roles'),
      },
      {
        path: '/menus',
        name: 'Menus',
        meta: {
          menu: '菜单',
          icon: 'el-icon-s-grid',
        },
        component: () => import('@/views/sys/menus'),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
