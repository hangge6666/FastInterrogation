<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import ConsultItem from './ConsultItem.vue'
import { ref } from 'vue'
import type { ConsultType } from '@/enums'
import { getConsultOrderList } from '@/api/consult'
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
//  问诊类型
const props = defineProps<{
  type: ConsultType
}>()
// 请求的分页参数
const params = {
  type: props.type, // 订单类型
  current: 1,
  pageSize: 10
}
const onLoad = async () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  const { data } = await getConsultOrderList(params)
  // 追加数据到列表中
  list.value.push(...data.rows)
  // 加载状态结束
  loading.value = false

  // 数据全部加载完成
  if (list.value.length >= data.total) {
    finished.value = true
  } else {
    // 为下一次准备
    params.current++
  }
}
const filterList = (item: ConsultOrderItem) => {
  list.value = list.value.filter((i) => i.id !== item.id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <consult-item @filter-list="filterList" v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
