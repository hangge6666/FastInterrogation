/**
 * 为项目全局组件声明
 */
// 核心代码
// 1. 导入组件实例
import NavBar from '@/components/cp-nav-bar/index.vue'
import CpIcon from '@/components/cp-icon/index.vue'
import CpRadioBtn from '@/components/cp-radio-btn/index.vue'
// 2. 声明 vue 类型模块
declare module 'vue' {
  // 3. 给 vue  添加全局组件类型，interface 和之前的合并
  interface GlobalComponents {
    // 4. 定义具体组件类型，typeof 获取到组件实例类型
    // typeof 作用是得到对应的TS类型
    VanNavBar: typeof NavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
  }
}
