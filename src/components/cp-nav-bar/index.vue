<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()
// 封装需求❓：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
const router = useRouter()
const onClickLeft = () => {
  if (props.back) {
    // 组织代码向后执行 return的作用
    return props.back()
  }
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickRight = () => {
  emit('click-right')
}
</script>

<template>
  <van-nav-bar
    :title="title"
    :right-text="rightText"
    left-arrow
    fixed
    @click-left="onClickLeft"
    @click-right="onClickRight"
  />
</template>

<style lang="scss" scoped>
/**
  深度作用选择符  样式穿透
  vue2 /deep/
*/
// 1.元素身上有data-v属性，直接拿类名控制
// .van-nav-bar {
//   box-sizing: border-box;
//   border: 2px solid red;
// }
// 2.元素身上没有 data-v属性 需要使用深度作用选择符

::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
