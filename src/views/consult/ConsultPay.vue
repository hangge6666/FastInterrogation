<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder, getConsultOrderPayUrl } from '@/api/consult'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { onMounted } from 'vue'
import { ref, computed } from 'vue'
import { getPatientDetail } from '@/api/user'
import { Toast, showConfirmDialog, showFailToast, showLoadingToast, showToast } from 'vant'
import { useRouter } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'

// 1.获取支付信息
const payInfo = ref<ConsultOrderPreData>()
const store = useConsultStore()
const router = useRouter()
const getPayInfo = async () => {
  try {
    const { data } = await getConsultOrderPre({
      type: store.consult.type, // 问诊类型： 极速问诊
      illnessType: store.consult.illnessType // 问诊级别：三甲或普通
    })
    // console.log('支付信息', data)
    payInfo.value = data
    //
    store.setCoupon(data.couponId)
  } catch (e) {
    router.push('/home')
  }
}
onMounted(() => {
  getPayInfo()
})

// 2.获取患者信息
const patient = ref<Patient>()
const getPatient = async () => {
  const { data } = await getPatientDetail(store.consult.patientId)
  console.log(data)
  patient.value = data
}
onMounted(() => {
  getPatient()
})

// 3.点击确定
const agree = ref(false)

// 4.计算真实的钱数
const actualPayment = computed(() => payInfo.value?.actualPayment || 0)

// 5.打开支付弹层
const show = ref(false)
const paymentMethod = ref<0 | 1>()
const orderId = ref('')
const openPay = async () => {
  if (!agree.value) return showFailToast('请勾选同意')
  show.value = true
  // 生成订单
  const { data } = await createConsultOrder(store.consult)
  orderId.value = data.id
  // 清空store的数据
  store.clear()
}

// 6.支付窗口打开后，订单创建成功不可以跳转
onBeforeRouteLeave(() => {
  // 存在订单id，说明订单已经创建成功了，页面不能在执行跳转
  if (orderId.value) return false
})

const onClose = async () => {
  try {
    await showConfirmDialog({
      title: '关闭支付',
      message: '确定取消支付吗',
      cancelButtonText: '仍要关闭',
      confirmButtonText: '继续支付'
    })
    // 点击确定 不关闭
    return false
  } catch (e) {
    orderId.value = ''
    router.push('/user/consult')
    return true
  }
}

// 点击支付弹层进行支付
const payOreder = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast('跳转支付')
  const { data } = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value, // 支付方式
    orderId: orderId.value, // 订单id
    payCallback: 'http://localhost:5173/room' // 回掉地址
  })
  // 跳转支付宝进行支付
  window.location.href = data.payUrl
}
</script>

<template>
  <div class="consult-pay-page">
    <cp-nav-bar title="支付" />
    <!-- 1. 支付信息 -->
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo?.pointDeduction}`" />
      <van-cell title="实付款" :value="payInfo?.actualPayment" class="pay-price" />
    </van-cell-group>
    <div class="pay-space"></div>
    <!-- 2. 患者信息  -->
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">支付协议</span></van-checkbox>
    </div>
    <!-- 3. 打开支付弹层并创建问诊订单 -->
    <van-submit-bar
      button-type="primary"
      :price="actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="openPay"
    />
  </div>
  <!-- 支付弹层 -->
  <van-action-sheet
    :closeable="true"
    v-model:show="show"
    title="选择支付方式"
    :close-on-popstate="false"
    :before-close="onClose"
  >
    <div class="pay-type">
      <p class="amount">￥{{ payInfo?.actualPayment.toFixed(2) }}</p>
      <van-cell-group>
        <van-cell title="微信支付" @click="paymentMethod = 0">
          <template #icon><cp-icon name="consult-wechat" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
        </van-cell>
        <van-cell title="支付宝支付" @click="paymentMethod = 1">
          <template #icon><cp-icon name="consult-alipay" /></template>
          <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
        </van-cell>
      </van-cell-group>
      <div class="btn">
        <van-button @click="payOreder" type="primary" round block>立即支付</van-button>
      </div>
    </div>
  </van-action-sheet>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
  .pay-info {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    align-items: center;
    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
      overflow: hidden;
    }
    .desc {
      flex: 1;
      > span {
        display: block;
        color: var(--cp-tag);
        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }
  .pay-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }
      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
  .pay-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    .text {
      color: var(--cp-primary);
    }
  }
  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
    }
  }
}
// 支付弹层样式
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
