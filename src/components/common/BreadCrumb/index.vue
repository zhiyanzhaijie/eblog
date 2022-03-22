<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" replace>
      <el-breadcrumb-item :to="{ path: '/dashboard' }">⛺</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ path: this.routes[1].path }"
      >{{this.routes[1].meta.menu}}</el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="this.routes.length > 2"
        :to="{ path: this.routes[2].path }"
      >{{this.routes[2].meta.menu}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    routes() {
      return this.$route.matched
    },
  },
}
</script>

<style>
</style>