<template>
  <div>
    <div class="header">
      <el-button type="primary" bound @click="handleOpen('new',0)">添加一级菜单</el-button>
    </div>
    <div class="mytree">
      <el-tree :data="list" :props="listProps" class="tree" accordion>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-if="data.pid===0"
              type="danger"
              size="mini"
              plain
              @click="handleOpen('remove',data)"
            >删除父级菜单</el-button>
            <el-button
              v-else
              type="danger"
              size="mini"
              plain
              @click="handleOpen('remove',data)"
            >删除子级菜单</el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              @click="handleOpen('edit',data)"
            >编辑</el-button>
            <el-button
              type="success"
              size="mini"
              plain
              @click="handleOpen('add',data)"
            >添加</el-button>
          </span>
        </span>
      </el-tree>

      <!-- 新增/编辑弹窗  -->
      <el-dialog
        :visible.sync="editVisible"
        :before-close="handleClose"
        :title="edit? '编辑菜单':'添加菜单'"
      >
        <el-form :model="menuForm" :rules="rules" :key="menuForm.id" ref="menu">
          <el-form-item label="路径" prop="path">
            <el-input v-model="menuForm.path"></el-input>
          </el-form-item>
          <el-form-item label="菜单名" prop="menuName">
            <el-input v-model="menuForm.menuName"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="menuForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="menuForm.component"></el-input>
          </el-form-item>
          <el-form-item label="重定向路径" prop="redirect">
            <el-input v-model="menuForm.redirect"></el-input>
          </el-form-item>
          <el-form-item label="是否隐藏" prop="hide">
            <el-radio v-model="menuForm.hide" :label="1">隐藏</el-radio>
            <el-radio v-model="menuForm.hide" :label="0">显示</el-radio>
          </el-form-item>
          <el-form-item label="是否可以接收参数" prop="props">
            <el-radio v-model="menuForm.props" :label="1">接收</el-radio>
            <el-radio v-model="menuForm.props" :label="0">不接收</el-radio>
          </el-form-item>
          <el-form-item label="权限" prop="roleLevel">
            <el-checkbox-group v-model="menuForm.roleLevel">
              <el-checkbox :label="3">admin</el-checkbox>
              <el-checkbox :label="2">author</el-checkbox>
              <el-checkbox :label="1">user</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button v-if="edit===false" type="primary" @click="createMenu">新增</el-button>
          <el-button v-else-if="edit===true" type="primary" @click="editMenu">修改</el-button>
        </div>
      </el-dialog>

      <!-- 删除弹窗 -->
      <RemoveDialog
        :visible.sync="removeVisible"
        @handleRemove="removeMenu"
        @handleClose="handleClose"
        :before-close="handleClose"
      />
    </div>
  </div>
</template>

<script>
import { get_menuslist, add_menus, remove_menus, edit_menus } from '@/api/menus'
import { toTree } from '@/utils'
import RemoveDialog from '@/components/common/RemoveDialog.vue'
export default {
  components: {
    RemoveDialog,
  },

  data() {
    const menuForm = {
      path: '',
      menuName: '',
      icon: '',
      component: '',
      pid: 0,
      roleLevel: [1, 2, 3],
      redirect: '',
      hide: 0,
      props: 0,
    }
    const rules = {
      path: [
        {
          required: true,
          message: '请输入路径',
          trigger: 'blur',
        },
      ],
      menuName: [
        {
          required: true,
          message: '请输入菜单名',
          trigger: 'blur',
        },
      ],
    }
    return {
      list: [],
      listProps: {
        children: 'children',
        label: 'menuName',
      },
      editVisible: false,
      removeVisible: false,
      edit: false,
      menuForm,
      rules,
      targetId: '',
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      get_menuslist().then((res) => {
        const { data } = res
        this.list = toTree(data.data, 0)
      })
      this.menuForm = {
        path: '',
        menuName: '',
        icon: '',
        component: '',
        pid: 0,
        roleLevel: [1, 2, 3],
        redirect: '',
        hide: 0,
        props: 0,
      }
    },
    load(data) {
      this.targetId = data.id
      this.menuForm.path = data.path
      this.menuForm.menuName = data.menuName
      this.menuForm.icon = data.icon
      this.menuForm.component = data.component
      this.menuForm.pid = data.pid
      this.menuForm.roleLevel = JSON.parse(data.roleLevel)
      this.menuForm.redirect = data.redirect
      this.menuForm.hide = data.hide
      this.menuForm.props = data.props
    },
    handleOpen(type, data) {
      if (type === 'edit') {
        this.editVisible = true
        this.edit = true
        this.load(data)
      } else if (type === 'add') {
        this.editVisible = true
        this.targetId = data.id
      } else if (type === 'remove') {
        // 判断父级元素是否清空子元素
        if (data?.children?.length) {
          this.$message.error('请先清空子级菜单')
          return
        }
        this.removeVisible = true
        this.load(data)
      } else if (type === 'new') {
        this.editVisible = true
        this.targetId = data
      }
      console.log(this.targetId)
    },
    handleClose() {
      this.editVisible = false
      this.removeVisible = false
      this.edit = false
      this.targetId = ''
      this.init()
    },
    removeMenu() {
      remove_menus(this.targetId)
        .then(() => {
          this.$message.success('修改菜单成功！')
          this.handleClose()
        })
        .catch((e) => {
          this.$message.error(JSON.parse(e))
        })
    },
    createMenu() {
      this.$refs['menu'].validate((valid) => {
        if (valid) {
          const data = { ...this.menuForm }
          data.pid = this.targetId
          console.log(data)
          add_menus(data)
            .then(() => {
              this.$message.success('成功增加表单')
              this.handleClose()
            })
            .catch((e) => {
              this.$message.error(JSON.parse(e))
            })
        } else {
          this.$message.error('输入格式有误！')
        }
      })
    },
    editMenu() {
      this.$refs['menu'].validate((valid) => {
        if (valid) {
          edit_menus(this.targetId, this.menuForm)
            .then(() => {
              this.$message.success('修改菜单成功！')
              this.handleClose()
            })
            .catch((e) => {
              this.$message.error(JSON.parse(e))
            })
        } else {
          this.$message.error('输入格式有误！')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  width: 80%;
  margin-top: 20px;
  text-align: right;
}
.btns {
  margin-top: 20px;
  text-align: center;
}
.tree {
  width: 80%;
  margin-top: 50px;
  margin-left: 30px;
  ::v-deep .el-tree-node__content {
    margin: 10px 0;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
}
::v-deep .mytree {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: '';
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    border-left: 1px dashed #4386c6;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    border-top: 1px dashed #4386c6;
    height: 20px;
    top: 12px;
    width: 24px;
  }
}
</style>
