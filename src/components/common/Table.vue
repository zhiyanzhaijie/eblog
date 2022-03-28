  <template>
  <div class="table-wrap">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%"
    >
      <template v-for="column in options.columns">
        <el-table-column
          v-if="!column.scope"
          :prop="column.prop"
          :key="column.prop"
          :label="column.label"
          :width="column.width ? column.width : null"
          :align="column.align? column.align:'center'"
          :formatter="column.formatter ==='time'? formatterTime: null"
        ></el-table-column>
        <el-table-column
          v-else
          :key="column.prop"
          :align="column.align? column.align:'center'"
          :label="column.label"
          :width="column.width ? column.width : null"
        >
          <template slot-scope="scope">
            <template v-if="column.scope === 'status'">
              <el-tag v-if="scope.row.status=== 1 " type="success">启用</el-tag>
              <el-tag v-if="scope.row.status=== 0 " type="warning">禁用</el-tag>
            </template>
            <template v-if="column.scope === 'action'">
              <el-button
                v-if="options.btns.includes('show')"
                icon="el-icon-search"
                circle
                @click="handleInfo(scope.row)"
              ></el-button>
              <el-button
                v-if="options.btns.includes('edit')"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="handleEdit(scope.row)"
              ></el-button>
              <el-button
                v-if="options.btns.includes('delete')"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="handleRemove(scope.row)"
              ></el-button>
            </template>
            <template v-if="column.scope === 'article-status'">
              <el-tag
                size="medium"
                effect="dark"
                :type="articleStatus[scope.row.status].type"
              >{{ articleStatus[scope.row.status].text }}</el-tag>
            </template>
            <!--  自定义插槽 -->
            <template v-else slot-scope="scope">
              <slot
                :name="column.scope"
                :data="scope.row"
                :index="scope.$index"
              ></slot>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page.pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

  <script>
import { parseTime } from '@/utils'
import { get_userList } from '@/api/user'
import { category_list } from '@/api/category'
import { article_list, article_list_all } from '@/api/article'
import { userInfo_list } from '@/api/app'
const apiList = {
  get_userList,
  category_list,
  article_list,
  article_list_all,
  userInfo_list,
}
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    const articleStatus = {
      0: {
        text: '草稿',
        type: 'info',
      },
      1: {
        text: '审核中',
        type: 'primary',
      },
      2: {
        text: '审核通过',
        type: 'success',
      },
      3: {
        text: '审核拒绝',
        type: 'danger',
      },
      4: {
        text: '已发布',
        type: 'warning',
      },
    }
    return {
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      tableData: [],
      total: 0,
      loading: false,
      articleStatus,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(queryObj) {
      // 初始化数据
      this.page = {
        pageSize: 10,
        pageNum: 1,
      }
      this.getList(queryObj)
    },
    getList(queryObj) {
      this.loading = true
      let data = { ...this.page }
      if (queryObj) {
        // 合并参数
        data = Object.assign(data, queryObj)
      }
      apiList[this.options.api](data)
        .then((res) => {
          if (this.options.api === 'article_list_all') {
            const filterData = res.data.rows.filter(
              (item) => item.status === 1 || item.status === 4
            )
            this.tableData = filterData
            this.total = filterData.length
          } else {
            this.tableData = res.data.rows
            this.total = res.data.count
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatterTime(row, column, cellValue) {
      return parseTime(new Date(cellValue))
    },
    handleInfo(item) {
      this.$emit('handleInfo', item)
    },
    handleEdit(item) {
      this.$emit('handleEdit', item)
    },
    handleRemove(item) {
      this.$emit('handleRemove', item)
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
.table-wrap {
  padding: 20px 0;
  .pagination {
    margin-top: 20px;
  }
}
</style>
