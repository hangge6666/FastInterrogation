import type {
  DoctorPage,
  FollowType,
  KnowledgePage,
  KnowledgeParams,
  PageParams,
  Image,
  TopDep,
  ConsultOrderPreData,
  ConsultOrderPreParams,
  PartialConsult,
  ConsultOrderItem
} from '@/types/consult'
import request from '@/utils/request'

// 获取健康知识列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request.get<KnowledgePage>('/patient/home/knowledge', { params })

// 获取关注医生列表
export const getDoctorPage = (params: PageParams) =>
  request.get<DoctorPage>('/home/page/doc', { params })

//关注功能实现
export const followDoctor = (id: string, type: FollowType = 'doc') =>
  request.post('/like', { id, type })

// 选择科室
export const getAllDep = () => request<TopDep[]>('/dep/all')

// 上传图片
// 上传病情描述图片
export const uploadImage = (file: File) => {
  const fd = new FormData()
  // 说明：formData对象的key属性值后台定义
  fd.append('file', file)
  return request.post<Image>('/upload', fd)
}
// 拉取预支付订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request.get<ConsultOrderPreData>('/patient/consult/order/pre', { params })

// 生成订单
export const createConsultOrder = (data: PartialConsult) =>
  request.post<{ id: string }>('/patient/consult/order', data)

// 获取支付地址  0 是微信  1 支付宝
export const getConsultOrderPayUrl = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request.post<{ payUrl: string }>('/patient/consult/pay', data)

// 获取订单详情的接口
export const getConsultOrderDetail = (orderId: string) =>
  request.get<ConsultOrderItem>('/patient/consult/order/detail', { params: { orderId } })
