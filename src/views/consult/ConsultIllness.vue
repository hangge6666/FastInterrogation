<script setup lang="ts">
import { ref } from 'vue'
import type { Image, InllnessType } from '@/types/consult'
import { computed, onMounted } from 'vue'
import { useConsultStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Dialog, showConfirmDialog } from 'vant'
import type { UploaderAfterRead, UploaderFileListItem } from 'vant/lib/uploader/types'
import { uploadImage } from '@/api/consult'
import { timeOptions, flagOptions } from '@/api/const'
// 患病时间选项
// const timeOptions = [
//   { label: '一周内', value: 1 },
//   { label: '一月内', value: 2 },
//   { label: '半年内', value: 3 },
//   { label: '大于半年', value: 4 }
// ]
// // 是否就诊选项
// const flagOptions = [
//   { label: '就诊过', value: 0 },
//   { label: '没就诊过', value: 1 }
// ]
// 1.记录病情描述:基本情况、患病时间、是否就诊过
const formData = ref<InllnessType>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})

//
// 通过计算数学判断是否可以用
const disabled = computed(() => {
  return (
    !formData.value.illnessDesc ||
    !formData.value.consultFlag === undefined ||
    !formData.value.illnessTime === undefined
  )
})
const router = useRouter()
const store = useConsultStore()
const next = () => {
  // 1.保存到pinia
  store.setIllness(formData.value)
  // 2.跳转页面
  router.push('/user/patient?isSel=1')
}

// 用户填完关闭了或者从下个页面回来，可以快速基于之前的数据进行修改
onMounted(() => {
  /** 每次进入病情描述页面
   *1.判断store中是否存储的有病情描述信息
   *2.如果有就给用户提示：是否恢复之前的填写
   */
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复之前填写的病情数据？',
      closeOnPopstate: false // 回退的时候也会显示
    })
      .then(() => {
        // 点击确定 恢复
        const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
        formData.value = { illnessDesc, illnessTime, consultFlag, pictures }
      })
      .catch(() => {
        // 点击取消 恢复
      })
  }
})

// 上传图片操作
const afterRead: UploaderAfterRead = (item) => {
  // 排除多图上传
  if (Array.isArray(item)) return
  // 排除非空上传
  if (!item.file) return
  // 开始上传
  item.status = 'uploading'
  item.message = '上传中....'
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      // 给item加上url是为了删除可以根据url进行删除
      item.url = res.data.url
      // 存储上传成功的url
      formData.value.pictures?.push(res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
// 删除图片
const onDeleteImg = (item: UploaderFileListItem) => {
  formData.value.pictures = formData.value.pictures?.filter((pic) => pic.url !== item.url)
}

// 文件预览
const fileList = ref<Image[]>([])
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 1. 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
        <p class="safe"><cp-icon name="consult-safe" /><span>内容仅医生可见</span></p>
      </div>
    </div>
    <!-- 2. 病情描述-表单 -->
    <div class="illness-form">
      <!-- 病情描述-基本情况 -->
      <van-field
        v-model="formData.illnessDesc"
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情，病情描述不能为空"
      ></van-field>
      <div class="item">
        <p>本次患病多久了？</p>
        <cp-radio-btn v-model="formData.illnessTime" :options="timeOptions" />
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过？</p>
        <cp-radio-btn v-model="formData.consultFlag" :options="flagOptions" />
      </div>
      <!-- 病情描述-图片上传 -->
      <div class="illness-img">
        <van-uploader
          :after-read="afterRead"
          upload-icon="photo-o"
          upload-text="上传图片"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          v-model="fileList"
          @delete="onDeleteImg"
        ></van-uploader>
        <p class="tip">上传内容仅医生可见,最多9张图,最大5MB</p>
      </div>
    </div>
    <!-- 下一步按钮：保存病情描述并且跳转到患者页面 -->
    <van-button :disabled="disabled" type="primary" block round @click="next"> 下一步 </van-button>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
