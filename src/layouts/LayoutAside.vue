<template>
  <el-menu
    :collapse="isCollapse"
    :collapse-transition="false"
    text-color="#ededed"
    active-text-color="#ffd04b"
    center
    router
    class="main"
  >
    <template v-for="route in filterroutes">
      <!-- 无子路由 -->
      <el-menu-item
        v-if="!route.children"
        :key="route.path"
        :index="route.path"
      >
        <i :class="route.meta.icon"></i>
        <span slot="title">{{ route.meta.menu }}</span>
      </el-menu-item>
      <!-- 存在子路由 -->

      <el-submenu v-else :key="route.path" :index="route.path">
        <template slot="title">
          <i :class="route.meta.icon"></i>
          <span slot="title">{{ route.meta.menu }}</span>
        </template>
        <el-menu-item
          v-for="subRoute in route.children"
          :key="subRoute.path"
          :index="subRoute.path"
        >
          <span slot="title">{{ subRoute.meta.menu }}</span>
        </el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['isCollapse', 'routes']),
    filterroutes() {
      let arr = []
      this.routes.map((route) => {
        if (!route.hidden) {
          if (route.children) {
            route.children = route.children.filter((child) => !child.hidden)
          }
          arr.push(route)
        }
      })
      return arr
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  border-right-width: 0px;
  ::v-deep .el-menu-item {
    background-color: #5d6972;
    :hover {
      color: #ffd04b;
    }
  }
  .is-active {
    background-color: #41474d;
  }
  ::v-deep .el-submenu {
    .el-submenu__title {
      background-color: #5d6972;
      :hover {
        color: #ffd04b;
      }
    }
    li {
      background-color: #515b64;
    }
  }
  ::v-deep i {
    color: #ffd04b;
  }
}
</style>