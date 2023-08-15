<script setup lang="ts">
import { uploadImage } from '@/api/consult'
import { showLoadingToast } from 'vant'
import type { Image } from '@/types/consult'
import type { UploaderAfterRead } from 'vant/lib/uploader/types'
import { ref } from 'vue'

// 1.发送文字消息
const text = ref('')
const emit = defineEmits<{
  (e: 'send-text', data: string): void
  (e: 'send-img', data: Image): void
}>()
// 点击发送之后 把聊天的文字发送给父组件
const sendText = () => {
  emit('send-text', text.value)
  text.value = ''
}

const props = defineProps<{
  disabled: boolean
}>()

// 2.发送图片消息
const sendImage: UploaderAfterRead = async (data) => {
  /**
   * 点击上传图标触发:
   * 1.调用上传api函数，上传选择的图片
   * 2.上传成功后获取到url，通过子传父传递图片
   * 3.父组件获取到图片，使用socket.emit发送图片给医生
   */
  if (Array.isArray(data)) return
  if (!data.file) return
  const t = showLoadingToast('上传中...')
  // {data:起别名}
  const { data: img } = await uploadImage(data.file)
  console.log('上传图片:', img)
  // 关闭loading
  t.close()
  emit('send-img', img)
}
</script>

<template>
  <div class="room-action">
    <van-field
      type="text"
      class="input"
      v-model="text"
      :border="false"
      placeholder="问医生"
      autocomplete="off"
      @keyup.enter="sendText"
      :disabled="disabled"
    ></van-field>
    <van-uploader :after-read="sendImage" :preview-image="false" :disabled="disabled">
      <cp-icon name="consult-img" />
    </van-uploader>
  </div>
</template>

<style lang="scss" scoped>
.room-action {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1;
  box-sizing: border-box;
  .input {
    background-color: var(--cp-bg);
    border: none;
    border-radius: 25px;
    margin-right: 10px;
    padding: 8px 15px;
  }
  .cp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
