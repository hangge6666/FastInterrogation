<script setup lang="ts">
import { ref } from 'vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { useUserStore } from '@/stores'
// 导入登陆的接口
import { loginByPassword, sendMobileCode, loginByMobile } from '@/api/user.ts'
import { useRoute, useRouter } from 'vue-router'
import { showFailToast, showSuccessToast, type FormInstance } from 'vant'
import { UseSendCode } from '@/views/login/service/index'
// 1.是否显示密码
const show = ref(false)

// 2.手机号
const phone = ref('')

// 3.密码
const password = ref('')

// 4.是否同意
const agree = ref(false)

// 5.兜底校验
const store = useUserStore()
// 获取路由
const router = useRouter()
// 获取路由参数
const route = useRoute()
const login = async () => {
  if (!agree.value) {
    return showFailToast('请勾选我已同意')
  }
  try {
    const res = isPassword.value
      ? await loginByPassword(phone.value, password.value)
      : await loginByMobile(phone.value, code.value)
    store.setUser(res.data)
    // 存在回调地址就跳转回跳地址 否则就跳转user
    router.push((route.query.returnUrl as string) || '/user')
    showSuccessToast('跳转成功')
  } catch (e) {
    console.log(e)
  }
}

// 改变登陆
const isPassword = ref(true)
const changeLoginType = () => {
  isPassword.value = !isPassword.value
}

// 验证码
const { code, codeWord, clickSend } = UseSendCode(phone.value)
/*const code = ref('')
const codeWord = ref('发送验证码')
// const form = ref<FormInstance>()
let flag = false
const clickSend = async () => {
  if (!flag) {
    flag = true
    let num = 59
    codeWord.value = `${num}秒后重新发送`
    let timer = setInterval(() => {
      num--
      codeWord.value = `${num}秒后重新发送`
      if (num === 0) {
        clearInterval(timer)
        flag = false
        codeWord.value = '重新发送验证码'
      }
    }, 1000)
  } else {
    return
  }
  // await form.value?.validate('phone')
  const res = await sendMobileCode(phone.value, 'login')
  code.value = res.data.code
}*/
</script>

<template>
  <cp-nav-bar title="登陆" right-text="注册" @click-right="$router.push('/register')"></cp-nav-bar>
  <div class="login">
    <div class="login-head">
      <h3>{{ isPassword ? '密码登陆' : '验证码登陆' }}</h3>
      <a href="javascript:;" @click="changeLoginType">
        <span>{{ isPassword ? '短信验证码登录' : '密码登陆' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <van-form autocomplete="off" @submit="login" ref="form">
      <!-- 手机号输入框 -->
      <van-field
        placeholder="请输入手机号"
        type="tel"
        v-model="phone"
        :rules="mobileRules"
      ></van-field>
      <!-- 密码输入框 -->
      <van-field
        v-if="isPassword"
        placeholder="请输入密码"
        :type="!show ? 'password' : 'text'"
        v-model="password"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon @click="show = !show" :name="show ? 'login-eye-on' : 'login-eye-off'"></cp-icon>
        </template>
      </van-field>

      <van-field v-else placeholder="输入验证码" type="text" v-model="code" :rules="codeRules">
        <template #button>
          <span @click="clickSend">{{ codeWord }}</span>
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  .van-form {
    padding: 0 14px;
    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
