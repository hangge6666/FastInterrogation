<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { computed, onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import type { DoctorList } from '@/types/consult'
import { getDoctorPage } from '@/api/consult'

// 1.原生js的方式
/*const width = ref(375)
onMounted(() => {
  width.value = window.innerWidth

  // 屏幕变化宽度变化
  window.addEventListener('resize', () => {
    width.value = window.innerWidth
  })
})*/

// 根据属性动态计算card的宽度

//2. 使用@vue/core
const { width } = useWindowSize()
const cardWidth = computed(() => {
  return (150 / 375) * width.value
})

//3.导入数据
const list = ref<DoctorList>()
const getList = async () => {
  const { data } = await getDoctorPage({ current: 1, pageSize: 5 })
  list.value = data.rows
}
onMounted(() => {
  getList()
})
</script>

<template>
  <div class="follow-doctor">
    <!-- 1.头部   -->
    <div class="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <!-- 2.医生列表   -->
    <div class="body">
      <!-- swipe 组件 -->
      <!--  单个医生的信息介绍    -->
      <!--  width宽度写死了    -->
      <van-swipe :width="cardWidth" :show-indicators="false" loop>
        <van-swipe-item v-for="item in list" :key="item.id">
          <doctor-card :item="item" />
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  // height: 250px;
  padding-bottom: 20px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
