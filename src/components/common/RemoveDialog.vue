<template>
  <el-dialog
    :visible="visible"
    width="30%"
    :before-close="handleClose"
    :show-close="false"
  >
    <span>是否删除该条数据?</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleRemove">确 定</el-button>
    </span>
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

<style></style>
