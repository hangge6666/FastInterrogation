import { createPinia } from 'pinia'
// 导入数据持久化的插件
import persisted from 'pinia-plugin-persistedstate'

// 1.创建pinia实例
const pinia = createPinia()

// 注册持久化插件
pinia.use(persisted)

// 2.导出pinia实例
export default pinia

// 对modules中store仓库做统一导出
export * from './modules/user'
export * from './modules/consult'
