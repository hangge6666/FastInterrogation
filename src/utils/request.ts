import axios from 'axios'
import { useUserStore } from '@/stores'
import { showFailToast } from 'vant'
import router from '@/router'
const baseURL = 'https://consult-api.itheima.net/'
const request = axios.create({
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    // 在发送请求之前做些什么
    if (store.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => console.log(err)
)

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data?.code !== 10000) {
      showFailToast(response.data.messgae)
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error) => {
    if (error.data?.code === 401) {
      const store = useUserStore()
      store.delUser()
      router.push(`/login?returnUrl = ${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default request
