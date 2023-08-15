<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPatientList, addPatient, editPatient, delPatient } from '@/api/user'
import type { Patient, PatientList } from '@/types/user'
import { computed, watch } from 'vue'
import { Toast, showConfirmDialog, showFailToast, showSuccessToast, showToast } from 'vant'
// 导入校验身份证格式插件
import Validator from 'id-validator'
import { useRoute } from 'vue-router'
import { useConsultStore } from '@/stores'
import { useRouter } from 'vue-router'

// 一、获取患者信息
const patientList = ref<PatientList>([])
// 获取患者列表的方法
const loadList = async () => {
  const res = await getPatientList()
  patientList.value = res.data
  // 如果支持选择患者同时满足档案中存在患者
  if (isSel.value && res.data.length > 0) {
    /**
     * 从患者列表中获取默认患者
     * 1.如果有：默认患者就选中
     * 2.如果没有：患者中第一个默认选择
     */
    const defPatient = res.data.find((item) => item.defaultFlag === 1)
    if (defPatient) {
      selectedPatientId.value = defPatient.id
    } else {
      selectedPatientId.value = res.data[0].id
    }
  }
}
onMounted(() => {
  loadList()
})

// 二、新增患者的功能
const show = ref(false)
const openDialog = (patientValue?: Patient) => {
  if (patientValue && patientValue.id) {
    const { id, gender, name, idCard, defaultFlag: flag } = patientValue
    patient.value = { id, gender, name, idCard, defaultFlag: flag }
    defaultFlag.value = flag ? true : false
  }
  show.value = true
}
const closeDialog = () => {
  show.value = false
  patient.value = {
    name: '',
    idCard: '',
    defaultFlag: 0,
    gender: 0
  }
}

// 三、单选按钮渲染
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

// 四、新增患者表单
const patient = ref<Patient>({
  name: '',
  idCard: '',
  defaultFlag: 0,
  gender: 0
})
// 是否是默认患者
const defaultFlag = ref(false)
// 监视属性变化
watch(defaultFlag, () => {
  patient.value.defaultFlag = defaultFlag.value ? 1 : 0
})

// 点击保存按钮后
// 创建校验生份证实例
const cardValid = new Validator()
const submit = async () => {
  /**
   * 1.校验患者名字和身份证
   *   校验生份证的格式
   * 2.校验通过调用api新增患者
   */
  if (!patient.value.name) return showToast('请输入名字')
  if (!patient.value.idCard) return showToast('请输入身份证')
  // 校验生份证格式
  // if (!cardValid.isValid(patient.value.idCard)) return showFailToast('身份证格式错误')
  // const { sex } = cardValid.getInfo(patient.value.idCard)
  // if (patient.value.gender !== sex) return showFailToast('选择性别和生份证不一致')

  try {
    if (patient.value.id) {
      await editPatient(patient.value)
    } else {
      await addPatient(patient.value)
    }
    // 关闭弹层
    closeDialog()
    // 重新刷新列表
    loadList()
    showSuccessToast('添加成功')
  } catch (e) {
    console.log(e)
  }
}
// 五、删除患者
const deletePatient = async () => {
  showConfirmDialog({
    title: '提示',
    message: '确认删除吗'
  })
    .then(async () => {
      if (patient.value.id) {
        // 确认
        await delPatient(patient.value.id)
      }
      // 关闭弹层
      closeDialog()
      // 重新刷新列表
      loadList()
      showSuccessToast('删除成功')
    })
    .catch(() => {
      // 取消
    })
}
// 六、家庭档案支持选择患者的功能
const route = useRoute()
console.log('路由参数', route)
const isSel = computed(() => {
  return route.query.isSel === '1'
})
// 点击选择患者
const selectedPatientId = ref<string | undefined>('')
const selPatient = (id: string | undefined) => {
  // 判断是否支持选中
  if (isSel.value) {
    selectedPatientId.value = id
  }
}

// 支持下一步 点击进入支付页面
const store = useConsultStore()
const router = useRouter()
const next = () => {
  /**
   * 1.判断是否选择了患者
   * 2.存储选中患者的ID到pinia
   */
  if (!selectedPatientId.value) return showFailToast('请选择一个患者看病')
  store.setPatient(selectedPatientId.value)
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <!-- 1.导航栏 -->
    <cp-nav-bar :title="isSel ? '选择患者' : '家庭档案'" />
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="isSel">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        class="patient-item"
        @click="selPatient(item.id)"
        v-for="item in patientList"
        :key="item.id"
        :class="{ selected: selectedPatientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/\d{6}(?=\d{6}$)/g, '******') }}</span>
          <span>{{ item.gender === 0 ? '女' : '男' }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <!-- 修改图片 -->
        <div class="icon"><cp-icon name="user-edit" @click="openDialog(item)" /></div>
        <!-- 默认患者显现 -->
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="patientList.length < 6" @click="openDialog()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 患者选择下一步 -->
    <div class="patient-next" v-if="isSel">
      <van-button type="primary" round block @click="next">下一步</van-button>
    </div>
    <!-- 新增患者弹出层 -->
    <van-popup v-model:show="show" position="right">
      <!-- 1.导航栏 -->
      <cp-nav-bar
        title="添加患者"
        right-text="保存"
        @click-right="submit"
        :back="closeDialog"
      ></cp-nav-bar>
      <!-- 2.新增患者表单 -->
      <van-form autocomplete="off">
        <van-field label="真实姓名" v-model="patient.name" placeholder="请输入真实姓名" />
        <van-field label="身份证号" v-model="patient.idCard" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 不是输入框 -->
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn :options="options" v-model="patient.gender"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <van-action-bar>
        <van-action-bar-button
          type="danger"
          @click="deletePatient"
          text="删除"
          v-if="patient.id"
        ></van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding-top: 46px;
    }
  }
}
.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
