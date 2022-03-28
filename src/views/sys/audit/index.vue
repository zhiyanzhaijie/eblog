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
          <el-select v-model="status" placeholder="状态" style="display: block">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="categoryId"
            placeholder="分类"
            style="display: block"
          >
            <el-option
              v-for="item in categoryOption"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
      <Table ref="table" :options="options" @handleInfo="handleInfo">
        <template v-slot:showHome="{ data }">
          <el-switch
            v-if="data.status === 4"
            v-model="data.showHome"
            active-color="#65A478"
            inactive-color="#F0ADA7 "
            :active-value="1"
            :inactive-value="0"
            @change="showHome(data.id, data.showHome)"
          ></el-switch>
        </template>
        <template v-slot:audit="{ data }">
          <el-button
            v-if="data.status === 1"
            size="small"
            type="success"
            plain
            :loading="loading"
            @click="audit(data.id, true)"
          >审核通过</el-button>
          <el-button
            v-if="data.status === 1"
            size="small"
            type="danger"
            plain
            :loading="loading"
            @click="audit(data.id, false)"
          >审核拒绝</el-button>
        </template>
      </Table>
      <!-- 详情页表单 -->
      <el-dialog
        :visible.sync="visible"
        width="80%"
        :before-close="
        () => {
          visible = false;
        }
      "
      >
        <!-- 这里用form组件的布局 -->
        <el-form label-width="8vw">
          <el-form-item label="标题">
            <span>{{ article.title }}</span>
          </el-form-item>
          <el-form-item label="作者">
            <span>{{ article.user }}</span>
          </el-form-item>
          <el-form-item label="分类">
            <span>{{ article.category }}</span>
          </el-form-item>
          <el-form-item label="封面">
            <img class="img" :src="article.cover" alt srcset />
          </el-form-item>
          <el-form-item label="内容">
            <!-- 无法通过配置关闭编辑页 通过样式修改 -->
            <mavon-editor
              class="editor"
              :toolbarsFlag="false"
              :editable="false"
              v-model="article.content"
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Table from '@/components/common/Table.vue'
import { category_list } from '@/api/category'
import { get_userList } from '@/api/user'
import { article_show, article_audit, article_showHome } from '@/api/article'
export default {
  components: { Table },
  data() {
    const options = {
      columns: [
        { prop: 'action', label: '操作', scope: 'action', width: '100' },
        { prop: 'audit', label: '审核', scope: 'audit' },
        { prop: 'id', label: 'ID', width: '100' },
        { prop: 'title', label: '标题' },
        { prop: 'status', label: '审核', scope: 'article-status' },
        { prop: 'showHome', label: '首页展示', scope: 'showHome' },
        { prop: 'createdAt', label: '创建时间', formatter: 'time' },
        { prop: 'updatedAt', label: '更新时间', formatter: 'time' },
      ],
      api: 'article_list_all',
      btns: ['show'],
    }
    const statusOption = [
      {
        label: '草稿',
        value: 0,
      },
      {
        label: '审核中',
        value: 1,
      },
      {
        label: '审核通过',
        value: 2,
      },
      {
        label: '审核拒绝',
        value: 3,
      },
      {
        label: '已发布',
        value: 4,
      },
    ]
    const queryOptions = [
      {
        label: '标题',
        value: 'title',
      },
      {
        label: '用户名',
        value: 'name',
      },
    ]
    return {
      options,
      statusOption,
      status: '',
      categoryOption: [],
      categoryId: '',
      queryOptions,
      key: 'title',
      keywords: '',

      visible: false,
      article: {
        title: '',
        user: '',
        category: '',
        content: '',
        cover: '',
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      category_list({ pageNum: 1, pageSize: 999 }).then((res) => {
        this.categoryOption = res.data.rows
      })
      get_userList({ pageNum: 1, pageSize: 999 }).then((res) => {
        this.userOption = res.data.rows
      })
    },
    querydefault() {
      this.status = ''
      this.categoryId = ''
      this.key = 'title'
      this.keywords = ''
    },
    handleInfo(item) {
      article_show(item.id).then((res) => {
        console.log(1)
        const data = res.data
        this.article.title = data.title
        this.article.category = data?.category?.name
        this.article.user = data?.user?.userinfo?.name
        this.article.content = data.content
        this.article.cover = process.env.VUE_APP_BASEURL + data.cover
        this.visible = true
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

        if (this.categoryId) {
          queryObj.queryCategoryId = this.categoryId
        }

        if (this.status !== '') {
          queryObj.queryStatus = this.status
        }
        this.$refs['table'].init(queryObj)
      }
    },
    audit(id, status) {
      this.loading = true
      article_audit(id, { status })
        .then(() => {
          this.$refs['table'].init()
          this.$notify({
            title: '成功',
            type: 'success',
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    showHome(id, value) {
      article_showHome(id, { status: Boolean(value) }).then(() => {
        this.$refs['table'].init()
      })
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
</style>
