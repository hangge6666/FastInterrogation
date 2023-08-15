import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'

import '@/styles/index.scss'
// 注册图标
import 'virtual:svg-icons-register'
// 导入提示框
import { Toast } from 'vant'
import 'vant/lib/index.css'
import 'vant/es/dialog/style'
import { ImagePreview } from 'vant'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Toast)
app.use(ImagePreview)

app.mount('#app')
