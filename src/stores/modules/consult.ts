/**
 * 极速问诊store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Consult, PartialConsult } from '@/types/consult'
import type { ConsultType } from '@/enums'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    // 1.定义全局共享需求
    const consult = ref<PartialConsult>({})
    // 2.修改问诊类型
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }

    // 3.问诊级别选择 => 三甲 普通
    const setIllnessType = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 4.选择科室
    const setDepId = (id: string) => {
      consult.value.depId = id
    }

    // 5.病情描述页面
    const setIllness = (
      illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 6.家庭档案
    const setPatient = (id: string) => {
      consult.value.patientId = id
    }

    // 7.记录优惠价
    const setCoupon = (id: string) => {
      consult.value.couponId = id
    }

    // 8.问诊订单创建成功后情况
    const clear = () => {
      consult.value = {}
    }
    return {
      consult,
      setType,
      setIllnessType,
      setDepId,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  {
    persist: true
  }
)
