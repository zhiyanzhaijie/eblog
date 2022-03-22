<template>
  <el-menu :collapse="isCollapse" :collapse-transition="false" router>
    <template v-for="route in routes">
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
    ...mapGetters(['isCollapse']),
    routes() {
      return this.$router.options.routes[2].children.filter(
        (item) => !item.hidden
      )
    },
  },
  methods: {},
}
</script>
