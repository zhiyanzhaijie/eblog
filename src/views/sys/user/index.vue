<template>
  <div>
    <!-- 筛选条 -->
    <el-row :gutter="20" class="user-picker">
      <el-col :span="6">
        <el-input v-model="keywords" placeholder="请输入内容">
          <el-select v-model="key" placeholder="请选择" slot="prepend">
            <el-option
              v-for="item in queryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            icon="el-icon-search"
            slot="append"
            @click="handleSearch('query')"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="16">
        <el-button type="info" plain @click="handleSearch('All')">查看全部</el-button>
        <el-button type="danger" plain @click="handleSearch(0)">查看禁用</el-button>
        <el-button type="success" plain @click="handleSearch(1)">查看启用</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="createVisible = true">新增用户</el-button>
      </el-col>
    </el-row>
    <Table
      :options="options"
      @handleInfo="handleInfo"
      @handleEdit="handleEdit"
      @handleRemove="handleRemove"
      ref="table"
    />
    <!-- 用户弹窗 -->
    <el-dialog
      class="userForm"
      :title="disabled ? '基本信息' : '编辑信息'"
      :visible.sync="searchVisible"
      width="60%"
      :before-close="handleShowDialogClose"
    >
      <el-form
        ref="editForm"
        :model="userInfo"
        :rules="rules"
        label-width="8vw"
      >
        <el-form-item label="ID" prop="id">
          <div>{{ userInfo.id }}</div>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <div>{{ userInfo.username }}</div>
        </el-form-item>
        <el-form-item v-if="!disabled" label="密码" prop="password">
          <el-input
            v-model="userInfo.password"
            type="password"
            :disabled="disabled"
            show-password
            placeholder="如果要更改请在此输入更改密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邀请码" prop="code">
          <div>{{ userInfo.code }}</div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="userInfo.status" :label="1" :disabled="disabled">启用</el-radio>
          <el-radio v-model="userInfo.status" :label="0" :disabled="disabled">禁用</el-radio>
        </el-form-item>
        <el-form-item v-if="!disabled" label="权限角色" prop="role">
          <el-select
            v-model="userInfo.userinfo.roleId"
            :disabled="operateRole<3"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleOption"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <div>{{ userInfo.createdAt | formatTime }}</div>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <div>{{ userInfo.updatedAt | formatTime }}</div>
        </el-form-item>
      </el-form>
      <div v-if="!disabled" slot="footer" class="dialog-footer">
        <el-button @click="handleShowDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除用户弹窗 -->
    <RemoveDialog
      :visible.sync="removeVisible"
      @handleRemove="removeUser"
      @handleClose="handleShowRemoveDialog"
    />

    <!-- 封装删除的dialog -->
    <!-- 新增用户弹窗 -->
    <el-dialog
      title="新增用户"
      :visible.sync="createVisible"
      width="30%"
      :before-close="
        () => {
          createVisible = false;
          this.user = {
            username: '',
            password: ''
          }
        }
      "
    >
      <el-form :model="user" ref="ruleForm" :rules="rules" label-width="60px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="user.password" type="password" show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { get_user, update_user, remove_user, add_user } from '@/api/user'
import { parseTime } from '@/utils'
import Table from '@/components/common/Table.vue'
import RemoveDialog from '@/components/common/RemoveDialog.vue'
import { updateUserInfo } from '@/api/app'
export default {
  components: {
    Table,
    RemoveDialog,
  },
  data() {
    const options = {
      columns: [
        { label: '操作', scope: 'action' },
        { prop: 'id', label: 'ID' },
        { prop: 'username', label: '用户名' },
        { prop: 'code', label: '邀请码' },
        { prop: 'status', label: '状态', scope: 'status' },
        { prop: 'createdAt', label: '注册时间', formatter: 'time' },
        { prop: 'updatedAt', label: '更新时间', formatter: 'time' },
      ],
      api: 'get_userList',
      btns: ['show', 'edit', 'delete'],
    }
    const queryOptions = [
      {
        value: 'username',
        label: '用户名',
      },
      {
        value: 'code',
        label: '邀请码',
      },
    ]
    const roleOption = [
      { label: '管理员', value: 3 },
      { label: '写手', value: 2 },
      { label: '普通用户', value: 1 },
    ]

    const user = {
      password: '',
      code: '00000000',
    }
    const rules = {
      username: [
        {
          required: false,
          message: '请输入用户名',
          trigger: 'blur',
        },
        { min: 6, max: 16, message: '用户名为6-16位', trigger: 'blur' },
      ],
      password: [
        {
          required: false,
          message: '请输入密码',
          trigger: 'blur',
        },
        { min: 6, max: 16, message: '密码为6-16位', trigger: 'blur' },
      ],
    }
    return {
      tableData: [],
      options,
      queryOptions,
      roleOption,
      operateRole: 0,
      key: 'username',
      keywords: '',
      userInfo: { userinfo: { roleId: 1 } },
      user,
      removeId: 0,
      searchVisible: false,
      removeVisible: false,
      createVisible: false,
      disabled: false,
      rules,
    }
  },
  filters: {
    formatTime(val) {
      return parseTime(new Date(val))
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.operateRole = this.$store.getters.userInfo.roleId
    },
    handleInfo(item) {
      get_user(item.id).then((res) => {
        this.userInfo = res.data
        this.searchVisible = true
      })
    },
    handleEdit(item) {
      if (this.userInfo.id !== item.id) {
        get_user(item.id).then((res) => {
          this.userInfo = res.data
        })
      }
      this.disabled = false
      this.searchVisible = true
    },
    handleRemove(item) {
      this.removeId = item.id
      this.removeVisible = true
    },
    handleShowDialogClose() {
      this.searchVisible = false
      this.disabled = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            username: this.userInfo.username,
            password: this.userInfo.password,
            status: this.userInfo.status,
          }
          update_user(this.userInfo.id, data).then(() => {
            updateUserInfo(this.userInfo.id, {
              roleId: this.userInfo?.userinfo?.roleId,
            })
            this.handleShowDialogClose()
            this.$refs['table'].init()
            this.$message.success('用户信息已更新')
          })
        } else {
          this.$message.error('信息填写错误')
        }
      })
    },
    handleShowRemoveDialog() {
      this.removeVisible = false
    },
    removeUser() {
      remove_user(this.removeId)
        .then((res) => {
          this.handleShowRemoveDialog()
          this.$message.success(res.success)
          this.$refs['table'].init()
        })
        .catch((e) => {
          this.handleShowRemoveDialog()
          this.$message.error(e)
          this.$refs['table'].init()
        })
    },
    handleSearch(type) {
      if (type === 'query') {
        this.$refs['table'].init({
          key: this.key,
          keywords: this.keywords,
        })
      } else if (type === 'All') {
        this.$refs['table'].init()
      } else if (type === 1) {
        this.$refs['table'].init({
          key: 'status',
          keywords: 1,
        })
      } else {
        this.$refs['table'].init({
          key: 'status',
          keywords: 0,
        })
        this.keywords = ''
      }
    },
    handleCreate() {
      add_user(this.user)
        .then(() => {
          this.$refs['table'].init()
          this.$message.success('添加成功')
        })
        .catch((e) => {
          this.$message.error(JSON.parse(e))
        })
      this.createVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.user-picker {
  margin-top: 20px;
  ::v-deep .el-select .el-input {
    width: 120px;
  }
  ::v-deep .el-input-group__append,
  ::v-deep .el-input-group__prepend {
    background-color: #fff;
  }
}
.userForm {
  .dialog-footer {
    text-align: center;
  }
}
.btns {
  text-align: center;
}
</style>
