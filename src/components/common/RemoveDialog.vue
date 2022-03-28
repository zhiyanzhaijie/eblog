<template>
  <el-dialog
    :visible="visible"
    width="30%"
    :before-close="handleClose"
    class="wrapper"
  >
    <div class="text">是否删除该条数据?</div>
    <div class="dialog-footer">
      <el-button @click="handleClose" round>取 消</el-button>
      <el-button type="primary" round @click="handleRemove">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: { visible: Boolean },
  methods: {
    handleRemove() {
      this.$emit('handleRemove')
    },
    handleClose() {
      this.$emit('handleClose')
    },
  },
}
</script>

<style lang='scss' scoped>
.wrapper {
  text-align: center;
  .text {
    padding: 20px 0 40px;
  }
  .dialog-footer {
  }
}
</style>
