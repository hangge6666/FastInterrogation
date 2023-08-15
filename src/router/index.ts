import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
// vue2 new Router
// vue3 createRouter()
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * 页面访问权限
 * vue2 to from next()
 * 说明：vue2需要放行
 * vue3 to from 不需要next了 直接retrun 就可以了
 */
router.beforeEach((to, from) => {
  //给页面动态添加title
  document.title = to.meta.title || '项目'
  /**
   * 页面访问拦截
   * 根据是否有token，决定用户to的的页面
   * 1.有token => 正常访问
   * 2.没有token => 跳会登陆页面 return 'path' 跳转回哪个页面
   */
  const store = useUserStore()
  // 没有token 也不是vip 就去登陆
  if (!store.user.token && !['/login', '/other'].includes(to.path)) {
    return '/login'
  }
})

export default router
