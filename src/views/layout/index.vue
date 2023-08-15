<template>
  <div class="layout-page">
    <!-- 上部：显示子路由 -->
    <router-view></router-view>
    <van-tabbar route>
      <van-tabbar-item to="/home">
        首页
        <!--  作用域插槽  -->
        <template #icon="{ active }">
          <cp-icon :name="`home-index-` + isActived(active)"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/article">
        健康百科
        <template #icon="{ active }">
          <cp-icon :name="`home-article-` + isActived(active)"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/notify">
        消息中心
        <template #icon="{ active }">
          <cp-icon :name="`home-notice-` + isActived(active)"></cp-icon>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/user">
        我的
        <template #icon="{ active }">
          <cp-icon :name="`home-mine-` + isActived(active)"></cp-icon>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
const isActived = (active: boolean): string => {
  return active ? 'active' : 'default'
}
</script>

<style scoped lang="scss">
// 样式穿透
::v-deep() {
}
</style>
