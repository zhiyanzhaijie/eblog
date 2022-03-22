<template>
  <div class="login-wrapper">
    <div class="box">
      <div class="to-login" :class="flag && 'hidden'">
        <h2>已有账号？请点击登录</h2>
        <div>
          <el-button class="btn" @click="changeType('login')">{{this.login}}</el-button>
        </div>
      </div>
      <div class="to-register" :class="flag && 'hidden'">
        <h2>还没有账号吗，欢迎使用我们</h2>
        <div>
          <el-button class="btn" @click="changeType('register')">{{this.signup}}</el-button>
        </div>
      </div>
      <div class="form" :class="[type, flag && type + '-move']">
        <!-- 登录页表单 -->
        <el-form
          v-if="type === 'login'"
          class="form-box"
          ref="loginForm"
          :rules="loginRules"
          :model="loginForm"
          key="login"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              status-icon
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="密码"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-row :gutter="20">
              <el-col :span="15">
                <el-input
                  v-model="loginForm.captcha"
                  maxlength="4"
                  placeholder="验证码"
                ></el-input>
              </el-col>
              <el-col :span="1">
                <div
                  class="captcha-wrapper"
                  v-html="captcha"
                  @click="getCaptcha"
                ></div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="submit">
            <el-button @click="submitForm('loginForm')" round>登录</el-button>
          </el-form-item>
        </el-form>
        <!-- 注册页表单 -->
        <el-form
          v-else
          class="form-box"
          ref="registerForm"
          :rules="registerRules"
          :model="registerForm"
          key="register"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              status-icon
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              show-password
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password2">
            <el-input
              v-model="registerForm.password2"
              type="password"
              show-password
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="registerForm.code"
              maxlength="8"
              placeholder="邀请码"
            ></el-input>
          </el-form-item>
          <el-form-item class="submit">
            <el-button @click="submitForm('registerForm')" round>注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCaptcha, userRegister } from '@/api/app'
import { mapActions } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      captcha: '(^_^)',
      type: 'login',
      flag: false,
      timer: null,
      login: '登录',
      signup: '注册',

      loginForm: {
        username: '',
        password: '',
        captcha: '',
      },
      registerForm: {
        username: '',
        password: '',
        password2: '',
        code: '',
      },
      loginRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
        captcha: { required: true, message: '请输入二维码', trigger: 'blur' },
      },
      registerRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur',
          },
        ],
        password2: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            validator: validatePass2,
            trigger: 'blur',
          },
        ],
        code: { required: true, message: '请输入邀请码', trigger: 'blur' },
      },
    }
  },
  computed: {},
  methods: {
    ...mapActions(['USER_LOGIN']),
    initForm() {
      ;(this.registerForm = {
        username: '',
        password: '',
        password2: '',
        code: '',
      }),
        (this.loginForm = {
          username: '',
          password: '',
          captcha: '',
        })
    },
    changeType(type) {
      if (this.timer) clearInterval(this.timer)
      this.initForm()
      this.flag = true
      this.type = type
      if (type === 'login') {
        this.login = '( *_^ )'
      } else {
        this.signup = '( ^_*  )'
      }
      this.timer = setInterval(() => {
        this.flag = false
        this.login = '登录'
        this.signup = '注册'
      }, 1500)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'loginForm') {
            // 调用vuex的登录方法
            this.USER_LOGIN(this.loginForm).then(() => {
              this.$router.push('/')
            })
          } else {
            userRegister(this.registerForm).then(() => {
              this.changeType('login')
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getCaptcha: debounce(function () {
      getCaptcha().then((res) => {
        this.captcha = res.data
      })
    }, 300),
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
    border-radius: 32px;
    .to-login {
      position: absolute;
      top: 160px;
      right: 65px;
      opacity: 0.9;
      transform: translate(0, -50%);
      transition: opacity 0.9s;
      &.hidden {
        opacity: 0;
      }
      > div {
        text-align: right;
      }
    }
    .to-register {
      position: absolute;
      top: 160px;
      left: 64px;
      opacity: 0.9;
      transform: translate(0, -50%);
      transition: opacity 0.9s;
      &.hidden {
        opacity: 0;
      }
      > div {
        text-align: light;
      }
    }
    .btn {
      width: 96px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 20px;
    }
    .form {
      position: absolute;
      top: -50px;
      height: 400px;
      width: 400px;
      background: #fff;
      border-radius: 16px;
      &.login {
        left: calc(80vw - 50px - 400px);
      }
      &.register {
        left: 50px;
      }
      &.login-move {
        animation: move-to-login 1.5s ease;
      }
      &.register-move {
        animation: move-to-register 1.5s ease;
      }
      .form-box {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        height: 80%;
        margin: 50px 40px 40px;
        .submit {
          text-align: center;
          line-height: 80px;
        }
        .captcha-wrapper {
          width: 100px;
          height: 40px;
          color: #beedc7;
          text-align: center;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
        }
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
