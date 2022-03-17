<template>
  <div class="login-wrapper">
    <div class="box">
      <div class="to-login" :class="flag && 'hidden'">
        <h2>已有账号？请点击登录</h2>
        <el-button @click="changeType('login')">{{ this.login }}</el-button>
      </div>
      <div class="to-register" :class="flag && 'hidden'">
        <h2>还没有账号吗，欢迎使用我们</h2>
        <el-button @click="changeType('register')">{{ this.signup }}</el-button>
      </div>
      <div class="form" :class="[type, flag && type + '-move']"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'login',
      flag: false,
      timer: null,
      login: '登录',
      signup: '注册',
    }
  },
  methods: {
    changeType(type) {
      if (this.timer) clearInterval(this.timer)
      this.flag = true
      this.type = type
      if (type === 'login') {
        this.login = '(^_ *)'
      } else {
        this.signup = '(*_^)'
      }
      this.timer = setInterval(() => {
        this.flag = false
        this.login = '登录'
        this.signup = '注册'
      }, 2000)
    },
  },
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  background: #cccccc;
  height: 100vh;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .box {
    height: 300px;
    width: 80vw;
    background: #3b3b3b;
    position: relative;
    border-radius: 2rem;
    .to-login {
      position: absolute;
      top: 10rem;
      right: 4rem;
      opacity: 0.9;
      transform: translate(0, -50%);
      transition: opacity 0.7s;
      &.hidden {
        opacity: 0;
      }
    }
    .to-register {
      position: absolute;
      top: 10rem;
      left: 4rem;
      opacity: 0.9;
      transform: translate(0, -50%);
      transition: opacity 0.7s;
      &.hidden {
        opacity: 0;
      }
    }
    el-button {
      position: absolute;
      top: 40rem;
    }
    .form {
      position: absolute;
      top: -50px;
      height: 400px;
      width: 400px;
      background: #fff;
      border-radius: 1rem;
      &.login {
        left: calc(80vw - 50px - 400px);
      }
      &.register {
        left: 50px;
      }
      &.login-move {
        animation: move-to-login 2s ease;
      }
      &.register-move {
        animation: move-to-register 2s ease;
      }
    }
  }
}
@keyframes move-to-login {
  0% {
    left: 50px;
  }
  100% {
    left: calc(80vw - 50px - 400px);
  }
}
@keyframes move-to-register {
  0% {
    left: calc(80vw - 50px - 400px);
  }
  100% {
    left: 50px;
  }
}
</style>
