<script setup lang="ts">
// 1.接收一个叫modelValue属性
defineProps<{
  modelValue: number
  show: boolean
}>()

// 2.定义自定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', data: number): void
  (e: 'update:show', data: boolean): void
}>()
</script>

<template>
  <div>子组件</div>
  <h3 v-show="show">你看不见我</h3>
  <ul>
    <li>{{ modelValue }}</li>
    <li>
      <button @click="emit('update:modelValue', 20)">点击修改</button>
    </li>
    <li>
      <button @click="emit('update:show', !show)">修改show</button>
    </li>
    <li></li>
  </ul>
</template>

<style lang="scss" scoped></style>
