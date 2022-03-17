<template>
  <el-row :gutter="20">
    <el-col :span="2">
      <i
        @click="CHANG_ISCOLLAPSE"
        class="icon"
        :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
      ></i>
    </el-col>
    <el-col :span="8">{{ time }}</el-col>
    <el-col :span="8">头像 昵称等</el-col>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      time: null,
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['isCollapse']),
  },
  created() {},
  mounted() {
    this.updateTime()
  },
  destroyed() {
    this.clearTime()
  },
  methods: {
    ...mapActions(['CHANG_ISCOLLAPSE']),

    // 定时显示头部时间
    updateTime() {
      this.clearTime()
      this.timer = setInterval(() => {
        this.time = parseTime(new Date())
      }, 1000)
    },
    // 清除计时器
    clearTime() {
      if (this.timer) clearInterval(this.timer)
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  cursor: pointer;
}
</style>
