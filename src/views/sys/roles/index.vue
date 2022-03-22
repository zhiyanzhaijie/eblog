<template>
  <div>
    <el-table :data="tableData" style="width: 100%" border="true">
      <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
      <el-table-column prop="username" label="姓名" align="center"></el-table-column>
      <el-table-column prop="code" label="邀请码" align="center"></el-table-column>
      <el-table-column
        prop="createdAt"
        label="创建日期"
        align="center"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column
        prop="updatedAt"
        label="更新日期"
        align="center"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column prop="operate" label="操作" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { get_userList } from '@/api/user'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      page: {
        pageSize: 10,
        pageNum: 1,
      },
      tableData: [],
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      const { data } = await get_userList(this.page)
      console.log(data.rows)
      this.tableData = data.rows
    },
    formatter(row, column, cellValue) {
      return parseTime(new Date(cellValue))
    },
  },
}
</script>

<style></style>
