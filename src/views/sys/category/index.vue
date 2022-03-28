<template>
  <div>
    <div class="header">
      <el-button type="primary" @click="handleCreate">新增分类</el-button>
    </div>
    <div class="main">
      <!-- 表格 -->
      <Table
        :options="options"
        @handleEdit="handleEdit"
        @handleRemove="handleRemove"
        ref="table"
      />
      <!-- 删除弹窗 -->
      <RemoveDialog
        :visible.sync="removeVisible"
        @handleClose="handleClose"
        @handleRemove="removeCategory"
      />
      <!-- 编辑/新增弹窗 -->
      <el-dialog
        :title="type==='edit'? '编辑分类': '新增分类'"
        :visible.sync="editVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
        >
          <el-form-item label="分类名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button @click="handleClose">取消</el-button>
          <el-button
            v-if="type === 'create'"
            type="primary"
            @click="editCategory"
          >新增</el-button>
          <el-button
            v-if="type === 'edit'"
            type="primary"
            @click="editCategory"
          >修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Table from '@/components/common/Table.vue'
import RemoveDialog from '@/components/common/RemoveDialog.vue'
import { category_put, category_delete, category_create } from '@/api/category'
export default {
  components: { Table, RemoveDialog },
  data() {
    const options = {
      columns: [
        { label: '操作', scope: 'action' },
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: '分类名' },
        { prop: 'createdAt', label: '注册时间', formatter: 'time' },
        { prop: 'updatedAt', label: '更新时间', formatter: 'time' },
      ],
      api: 'category_list',
      btns: ['edit', 'delete'],
    }
    const ruleForm = { name: '' }
    const rules = {
      name: [
        { require: true, message: '请输入分类名 ', trigger: 'blur' },
        { min: 1, max: 6, message: '请输入1-6位字符', trigger: 'blur' },
      ],
    }
    return {
      options,
      removeVisible: false,
      editVisible: false,
      type: '',
      ruleForm,
      rules,
      targetId: 0,
    }
  },
  methods: {
    handleRemove(item) {
      this.removeVisible = true
      this.targetId = item.id
    },
    handleEdit(item) {
      this.editVisible = true
      this.type = 'edit'
      this.targetId = item.id
      this.ruleForm.name = item.name
    },
    handleCreate() {
      this.editVisible = true
      this.type = 'create'
    },
    handleClose() {
      this.editVisible = false
      this.removeVisible = false
      this.ruleForm.name = ''
      this.type = ''
    },
    editCategory() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            category_put(this.targetId, this.ruleForm)
              .then(() => {
                this.$message.success('修改分类成功')
              })
              .catch((e) => {
                this.$message.error(JSON.parse(e))
              })
          } else if (this.type === 'create') {
            category_create(this.ruleForm)
              .then(() => {
                this.$message.success('创建分类成功')
              })
              .catch((e) => {
                this.$message.error(JSON.parse(e))
              })
          }
          this.$refs['table'].init()
          this.handleClose()
        } else {
          this.$message.error('表单不符合规范')
          return false
        }
      })
    },
    removeCategory() {
      category_delete(this.targetId)
        .then(() => {
          this.$message.success('删除分类成功')
        })
        .catch((e) => {
          this.$message.error(JSON.parse(e))
        })
      this.$refs['table'].init()
      this.handleClose()
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  margin-top: 20px;
}
.btns {
  text-align: center;
}
</style>
