<script setup lang="ts">
import type { KnowledgeType, KnowledgeList } from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'
import { ref } from 'vue'
import { getKnowledgePage } from '@/api/consult'
//接收type的类型
const props = defineProps<{
  type: KnowledgeType
}>()

const list = ref<KnowledgeList>([])
const loading = ref(false)
// 控制列表数据是否加载完成了
const finished = ref(false)

//请求的分页参数
const params = {
  type: props.type, // 类型
  current: 1, // 当前页
  pageSize: 10 // 每页总数
}

const onLoad = async () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  const { data } = await getKnowledgePage(params)
  // 把当前页追加到list列表中
  list.value.push(...data.rows)
  // 加载状态结束
  loading.value = false

  // 数据全部加载完成
  if (list.value.length >= data.total) {
    finished.value = true
  } else {
    // 数据没有加载完? 把页码加一
    params.current++
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
