import { ref } from 'vue'
import type { FollowType } from '@/types/consult'
import { followDoctor } from '@/api/consult'
import { showSuccessToast } from 'vant'

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
export { useFollow }
