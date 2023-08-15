<template>
  <!-- 1.语法糖写法 -->
  <Son v-model="count" v-model:show="show"> </Son>
  <!-- 完整写法 -->
  <Son :model-value="count" @update:model-value="count = $event" @update:show="show = $event"></Son>
  <hr />
  <!-- <cp-nav-bar title="注册" rightText="注册"></cp-nav-bar> -->
  <div>
    <ul>
      <li>{{ store.user }}</li>
      <li @click="changeUser">修改user</li>
      <li></li>
    </ul>
  </div>
  <svg aria-hidden="true">
    <!-- #icon-文件夹名称-图片名称 -->
    <use href="#icon-login-eye-off" />
  </svg>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import request from '@/utils/request'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Son from './son.vue'
// 导入封装的request

const store = useUserStore()

// 获取当前页面的地址
const route = useRoute()
console.log(route)

// 点击修改用户store中的数据
const changeUser = () => {
  store.setUser({ id: '1', mobile: '1', account: '1', avatar: '1', token: '1' })
}

// 测试request
// 测试401
const getHome = async () => {
  const info = request.get('/patient/myUser')
  console.log(info)
}

// 测试正常情况
const login = async () => {
  const res = await request.post('/login/password', {
    mobile: '13211112222',
    password: 'abc12345'
  })
  console.log('res', res)
}

onMounted(() => {
  login()
})

/**
 * ts问题
 */
type Obj = {
  name: string
  age: number
}

let obj = ref<Obj>() // 范型用！
// obj.value!.age = 10 // ！在ts中是非空断言
let obj2 = ref({} as Obj)
obj2.value.age = 20 // 断言后可以直接.赋值

/**
 * v-model语法糖
 * 背景：父子通信 父传子的变量，因为遵循单向数据流，父传子的变量只能通过子传父自定事件，去修改父组件的变量
 * v-model的效果
 * v-model绑定的父的变化
 * 1.父的变化 => 子变化
 * 2.子变化 => 父亲的变量变化
 * 3.原理
 */
const count = ref(1)
const show = ref(true)
</script>

<style lang="scss" scoped>
// 1.通过scss定义变量 => 语法：$变量名:css变量值
$fontColor: red;
html {
  color: $fontColor;
}
// 原生css变量定义
// 语法：
//  1. 定义：--css变量名:css变量值
//  2. 使用：var(--css变量名)
//  作用域：
//  1. 局部变量 =》 .类名 {    }
//  2. 全局变量 =》 :root {    }
</style>
