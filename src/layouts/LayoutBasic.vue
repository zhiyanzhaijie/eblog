<template>
  <el-container>
    <el-aside :width="isCollapse? '64px':'200px'">
      <layout-aside />
    </el-aside>
    <el-container>
      <el-header>
        <layout-header />
      </el-header>
      <el-main>
        <bread-crumb class="bread-crumb" />
        <router-view class="router-view"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutAside from './LayoutAside.vue'
import LayoutHeader from './LayoutHeader.vue'
import BreadCrumb from '@/components/common/BreadCrumb'
export default {
  components: { LayoutAside, LayoutHeader, BreadCrumb },
  computed: {
    ...mapGetters(['isCollapse']),
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
  background: hsla(0, 0%, 100%, 0.6);
}

::-webkit-scrollbar-track {
  border-radius: 0;
}

::-webkit-scrollbar-thumb {
  border-radius: 0;
  background-color: rgba(95, 95, 95, 0.4);
  transition: all 0.2s;
  border-radius: 0.5rem;

  &:hover {
    background-color: rgba(95, 95, 95, 0.7);
  }
}
.el-header {
  background-color: #5d6972;
  color: #dee2e4;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #5d6972;
  color: #dee2e4;
}

.el-main {
  background-color: #ededed;
  height: calc(100vh - 60px);
  overflow: hidden !important;
  .router-view {
    background-color: #fbfaf9;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 2px 2px 5px rgba(95, 95, 95, 0.3);
  }
  .bread-crumb {
    padding: 10px 0 10px 10px;
    margin-top: -15px;
  }
}
</style>
