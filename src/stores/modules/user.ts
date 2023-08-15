/**
 * 存储登陆用户相关的数据
 */

import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'cp-user',
  () => {
    // 1.全局变量 登陆用户的变量
    // 空对象的变量通过as断言指定类型
    const user = ref<User>({} as User)

    // 方法
    // 1.存储用户信息
    const setUser = (u: User) => {
      user.value = u
    }

    // 2.删除用户信息
    const delUser = () => {
      user.value = {} as User
    }
    return {
      user,
      setUser,
      delUser
    }
  },
  // 方式1:默认存储全部数据 以store的ID作为存储的key
  // 方式2: 自定义存储的key 指定存储哪些数据
  {
    persist: {
      key: 'cp-user',
      // 要存储的变量名
      paths: ['user']
    }
  }
)
