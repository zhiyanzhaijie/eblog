<template>
  <div>
    <el-button @click="getMenus">获取</el-button>
  </div>
</template>

<script>
import { get_menus } from '@/api/menus'
// import { toTree } from '@/utils'
export default {
  data() {
    const menus = {}
    return {
      menus,
    }
  },
  methods: {
    async getMenus() {
      get_menus()
        .then((res) => {
          const { data } = res
          console.log(data.data)
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
}
</script>

<style></style>
