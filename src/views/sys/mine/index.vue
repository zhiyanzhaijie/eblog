<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="昵称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="瞧，这是你的名字"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="你的手机号！" maxlength="11"></el-input>
      </el-form-item>
      <!-- 头像 -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          :action="action"
          name="blogImg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
        >
          <img
            v-if="ruleForm.avatar"
            :src="'http://127.0.0.1:7001/public/' + ruleForm.avatar"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- 省市区 -->
      <el-form-item label="地区">
        <el-cascader
          v-model="region"
          :props="{ lazy: true,lazyLoad: this.getRegion, expandTrigger: 'hover' }"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button @click="updateForm">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getProvinceId, getCityId, getAreaId } from '@/api/public'
import { updateUserInfo } from '@/api/app'
export default {
  data() {
    var checkMobile = (rule, phoneNum, callback) => {
      if (!/^1[3456789]\d{9}$/.test(phoneNum)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      // 表单信息
      ruleForm: {
        name: '',
        mobile: '',
        avatar: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      },
      action: '/admin/upload/img',
      // 请求Headers
      headers: {
        authorization: '',
      },
      // 表单校验规则
      rules: {
        name: [
          {
            required: true,
            message: '昵称不能为空',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 16,
            message: '请输入6-16位字符',
            trigger: 'blur',
          },
        ],
        mobile: [
          {
            validator: checkMobile,
            trigger: 'blur',
          },
        ],
      },
      // 省市区
      region: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'Token', 'userId']),
  },
  mounted() {
    this.initData()
  },
  methods: {
    ...mapActions(['SET_USER_INFO']),
    getRegion(node, resolve) {
      const { data, level } = node
      if (level === 0) {
        //   省
        getProvinceId().then((res) => {
          const nodes = res.data.map((item) => {
            return {
              value: item.provinceCode,
              label: item.name,
              leaf: false,
            }
          })
          resolve(nodes)
        })
      } else if (level === 1) {
        //   市
        getCityId(data.value).then((res) => {
          const nodes = res.data.map((item) => {
            return {
              value: item.cityCode,
              label: item.name,
              leaf: false,
            }
          })
          resolve(nodes)
        })
      } else if (level === 2) {
        getAreaId(data.value).then((res) => {
          const nodes = res.data.map((item) => {
            return {
              value: item.areaCode,
              label: item.name,
              leaf: true, // 最后一个节点 则为true
            }
          })
          resolve(nodes)
        })
      }
    },
    initData() {
      this.ruleForm.name = this.userInfo.name
      this.ruleForm.mobile = this.userInfo.mobile
      this.ruleForm.provinceId = this.userInfo.provinceId
      this.ruleForm.cityId = this.userInfo.cityId
      this.ruleForm.areaId = this.userInfo.areaId
      this.ruleForm.avatar = this.userInfo.avatar
      this.headers.authorization = this.Token
    },

    handleAvatarSuccess(res, file) {
      this.ruleForm.avatar = file.response.data.filename
    },
    // 检查图片尺寸
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async updateForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 解析当前值赋值为新路径
          const data = { ...this.ruleForm }
          data.provinceId = this.region[0]
          data.cityId = this.region[1]
          data.areaId = this.region[2]
          // 更新用户信息接口 并 保存vuex
          updateUserInfo(this.userId, data).then((res) => {
            this.SET_USER_INFO(this.userId)
            this.$message({
              message: res.data,
              type: 'success',
            })
          })
        } else {
          this.$message.error('信息输出有误')
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 60vh;
  width: 40vw;
  font-size: 20px;
  font-weight: bold;
  padding: 50px 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
