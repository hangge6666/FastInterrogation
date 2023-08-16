import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
import { followDoctor } from '@/api/consult'
import { showSuccessToast } from 'vant'
import { getPrescriptionPic } from '@/api/consult'
import { showImagePreview } from 'vant'
import { showToast } from 'vant'
import { watch } from 'vue'
import { useClipboard } from '@vueuse/core'
/**
 * 全局可以复用的hooks函数
 * 1.相同部分拷贝
 * 2.不同部分以参数传递
 */
const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (doc: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followDoctor(doc.id, type)
      doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
      showSuccessToast(doc.likeFlag === 1 ? '关注成功' : '取关成功')
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    follow
  }
}

// 查看处方
const useLookPre = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)
      showImagePreview([res.data.url])
    }
  }
  return showPrescription
}

// 复制
const useCopy = () => {
  const { copy, copied, isSupported } = useClipboard()
  const onCopy = (copyText: string) => {
    if (isSupported.value) {
      return showToast('系统不支持')
    }
    copy(copyText)
  }
  // 监听是否成功
  watch(copied, () => {
    if (copied.value) showToast('复制成功')
  })
  return { onCopy }
}
export { useFollow, useLookPre, useCopy }
