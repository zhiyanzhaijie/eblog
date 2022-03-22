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
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="headers"
        >
          <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" />
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- 省市区 -->
      <el-form-item label="地区">
        <el-cascader
          v-model="region"
          :options="region"
          :props="{ lazy: true,lazyLoad: this.getRegion, expandTrigger: 'hover' }"
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button @click="set">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getProvinceId, getCityId, getAreaId } from '@/api/public'
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
      ruleForm: {
        name: '',
        mobile: '',
        avatar: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      },
      headers: {
        authorization: '',
      },
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
      region: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'Token']),
    getProvinceId() {
      return this.getProvinceId()
    },
    getCityId() {
      return this.getCityId()
    },
    getAreaId() {
      return this.getCityId()
    },
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
    initData() {},
    set() {
      this.initData(this.userInfo), console.log(this.region)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
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
  },
}
</script>

<style>
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
