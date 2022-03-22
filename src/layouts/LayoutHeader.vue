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
    <el-col :span="4" :offset="10">
      <div class="wrapper">
        <img
          class="avatar"
          :src="'http://127.0.0.1:7001/public/'+userInfo.avatar||require('../assets/image/avatardefault.png')"
        />

        <div>{{userInfo.name}}</div>
        <div class="cursor">
          <i class="el-icon-setting icon" @click="drawer=true"></i>
        </div>
      </div>
    </el-col>
    <el-drawer :visible.sync="drawer" size="16%" class="drawer">
      <h3 @click="toMine">
        <i class="el-icon-user icon"></i>
        <span>写手中心</span>
      </h3>
      <h3>
        <i class="el-icon-position icon"></i>
        <span>关于我们</span>
      </h3>
      <h3 @click="logOut">
        <i class="el-icon-switch-button icon"></i>
        <span>退出</span>
      </h3>
    </el-drawer>
  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import { removeToken, removeUserid } from '@/utils/storage'
export default {
  data() {
    return {
      time: null,
      drawer: false,
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['isCollapse', 'userInfo']),
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
    toMine() {
      this.$router.push('/mine')
    },
    logOut() {
      this.$confirm('确认要离开了吗', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '再等等',
        type: 'notice',
      }).then(() => {
        // 结算等待封装
        this.$router.push('/login')
        removeUserid()
        removeToken()
        this.$message({
          type: 'success',
          message: '你已退出登录',
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.icon {
  cursor: pointer;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
.drawer {
  h3 {
    margin: 0;
    &:hover {
      cursor: pointer;
      background: #fde6e0;
    }
    &:active {
      color: #fff;
    }
    i {
      font-weight: lighter;
      padding-right: 20px;
    }
  }
}
</style>
