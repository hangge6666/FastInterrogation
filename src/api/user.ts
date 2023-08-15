import request from '@/utils/request'
import type { CodeType, User, UserInfo, PatientList, Patient } from '@/types/user'
/**
 * 通过密码登陆
 * @param mobile
 * @param password
 * @returns
 */
export const loginByPassword = (mobile: string, password: string) =>
  request.post<User>('/login/password', { mobile, password })
/**
 * 获取验证码
 * @param mobile
 * @param type
 * @returns
 */
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request.get('/code', { params: { mobile, type } })
/**
 * 通过验证码登陆
 * @param mobile
 * @param code
 * @returns
 */
export const loginByMobile = (mobile: string, code: string) =>
  request.post<User>('/login', { mobile, code })

/**
 * 获取用户的个人信息
 * @returns
 */
export const getUserInfoApi = () => request.get<UserInfo>('/patient/myUser')

/**
 * 获取患者信息
 *
 */
export const getPatientList = () => request.get<PatientList>('/patient/mylist')

/**
 * 新增患者
 */
export const addPatient = (patient: Patient) => request.post('/patient/add', patient)

/**
 * 编辑患者
 */
export const editPatient = (patient: Patient) => request.put('/patient/update', patient)

// 删除患者信息
export const delPatient = (id: string) => request.delete(`/patient/del/${id}`)

// 查询患者详情
export const getPatientDetail = (id: string | undefined) =>
  request.get<Patient>(`/patient/info/${id}`)
