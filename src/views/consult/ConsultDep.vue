<script setup lang="ts">
import { getAllDep } from '@/api/consult'
import { useConsultStore } from '@/stores'
import type { TopDep } from '@/types/consult'
import { ref, onMounted, computed } from 'vue'

// 获取所有科室数据
const active = ref(0)
const allDep = ref<TopDep[]>([])
const getAllDepApi = async () => {
  const { data } = await getAllDep()
  // console.log('所有科室数据', data)
  allDep.value = data
}
onMounted(() => {
  getAllDepApi()
})

// 点击一级科室动态渲染子科室
const sonDep = computed(() => {
  return allDep.value[active.value]?.child
})

// 点击二级科室记录问诊科室id
const store = useConsultStore()
</script>

<template>
  <!-- 2. 极速问诊-选择科室 -->
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 一级科室 -->
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="top in allDep" :key="top.id" :title="top.name" />
      </van-sidebar>
      <!-- 二级科室 -->
      <div class="sub-dep">
        <router-link
          @click="store.setDepId(item.id)"
          to="/consult/illness"
          v-for="item in sonDep"
          :key="item.id"
          >{{ item.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}

.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
