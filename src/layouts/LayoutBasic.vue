<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <layout-aside />
    </el-aside>
    <el-container>
      <el-header>
        <layout-header />
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutAside from './LayoutAside.vue'
import LayoutHeader from './LayoutHeader.vue'

export default {
  components: { LayoutAside, LayoutHeader },
  computed: {
    ...mapGetters(['isCollapse']),
  },
}
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
  height: calc(100vh - 60px);
}
</style>
