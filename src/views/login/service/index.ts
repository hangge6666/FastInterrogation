import { ref } from 'vue'
import { sendMobileCode } from '@/api/user'

export function UseSendCode(mobile: string) {
  // 验证码
  const code = ref('')
  const codeWord = ref('发送验证码')
  let flag = false
  const clickSend = async () => {
    if (!flag) {
      flag = true
      let num = 59
      codeWord.value = `${num}秒后重新发送`
      const timer = setInterval(() => {
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
    const res = await sendMobileCode(mobile, 'login')
    code.value = res.data.code
  }
  return {
    code,
    codeWord,
    clickSend
  }
}
