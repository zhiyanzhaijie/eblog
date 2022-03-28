<template>
  <div>
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="6" class="select">
          <el-input v-model="keywords" placeholder="请输入内容">
            <el-select v-model="key" placeholder="请选择" slot="prepend">
              <el-option
                v-for="item in queryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="queryRoleId"
            placeholder="权限等级"
            style="display: block"
          >
            <el-option
              v-for="item in roleIdOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button icon="el-icon-delete" round @click="querydefault"></el-button>
          <el-button type="danger" round @click="handleSearch">搜索</el-button>
        </el-col>
        <el-col :span="2" :offset="3">
          <el-button type="info" @click="handleSearch('all')">查看全部</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <!-- 表单 -->
      <Table ref="table" :options="options" @handleEdit="handleEdit">
        <template v-slot:showRoleId="{data}">
          <el-tag v-if="data.roleId === 3" type="danger">管理员</el-tag>
          <el-tag v-if="data.roleId === 2" type="warning">写手</el-tag>
          <el-tag v-if="data.roleId === 1" type="info">普通用户</el-tag>
        </template>
      </Table>
      <!-- 详情页表单 -->
      <el-dialog
        title="编辑权限"
        class="editdialog"
        :visible.sync="visible"
        width="30%"
        :before-close="
        () => {
          visible = false;
        }
      "
      >
        <!-- 这里用form组件的布局 -->
        <el-form :model="userInfo">
          <div class="dialog-main">
            <el-radio-group v-model="userInfo.roleId">
              <el-radio :label="1" border>普通用户</el-radio>
              <el-radio :label="2" border>写手</el-radio>
              <el-radio :label="3" border>管理员</el-radio>
            </el-radio-group>
          </div>
          <div class="dialog-footer">
            <el-button @click="() => { visible=false }">取 消</el-button>
            <el-button type="primary" @click="changeRoleId">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Table from '@/components/common/Table.vue'
import { getUserInfo, updateUserInfo } from '@/api/app'
export default {
  components: { Table },
  data() {
    const options = {
      columns: [
        { prop: 'action', label: '操作', scope: 'action', width: '100' },
        { prop: 'name', label: '用户名' },
        { prop: 'userId', label: 'ID', width: '100' },
        { prop: 'roleId', label: '权限等级', scope: 'showRoleId' },
        { prop: 'createdAt', label: '创建时间', formatter: 'time' },
        { prop: 'updatedAt', label: '更新时间', formatter: 'time' },
      ],
      api: 'userInfo_list',
      btns: ['edit'],
    }
    const roleIdOption = [
      {
        label: '管理员',
        value: 3,
      },
      {
        label: '写手',
        value: 2,
      },
      {
        label: '普通用户',
        value: 1,
      },
    ]
    const queryOptions = [
      {
        label: '用户名',
        value: 'username',
      },
    ]
    return {
      options,
      roleIdOption,
      queryRoleId: '',
      queryOptions,
      key: 'username',
      keywords: '',

      visible: false,
      userInfo: {},
    }
  },
  methods: {
    querydefault() {
      this.queryRoleId = ''
      this.key = 'username'
      this.keywords = ''
    },
    handleEdit(item) {
      getUserInfo(item.userId)
        .then((res) => {
          this.userInfo = res.data
        })
        .finally(() => {
          this.visible = true
        })
    },
    changeRoleId() {
      const data = { roleId: parseInt(this.userInfo.roleId) }
      const userId = parseInt(this.userInfo.userId)
      updateUserInfo(userId, data)
        .then((res) => {
          this.$refs['table'].init()
          this.$message.success(res.data)
        })
        .finally(() => {
          this.visible = false
        })
    },
    handleSearch(type) {
      if (type === 'all') {
        this.$refs['table'].init()
      } else {
        //  处理参数
        const queryObj = {}
        if (this.keywords) {
          queryObj.keywords = this.keywords
          queryObj.key = this.key
        }
        if (this.queryRoleId !== '') {
          queryObj.queryRoleId = this.queryRoleId
        }
        this.$refs['table'].init(queryObj)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  margin-top: 20px;
  .select ::v-deep .el-select .el-input {
    width: 120px;
  }
  .select ::v-deep .el-input-group__prepend {
    background-color: #fff;
  }
}
.main {
  .img {
    height: 200px;
    width: 200px;
  }

  .editor {
    ::v-deep .v-note-edit {
      display: none;
    }
    ::v-deep .v-note-panel .v-note-show {
      flex: 1;
      -webkit-box-flex: 1;
    }
  }
}
.editdialog {
  margin-top: 20px;
  .dialog-main {
    margin: 0 auto;
    padding: 100px 0;
    display: flex;
    justify-content: center;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
