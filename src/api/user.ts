import { AxiosResponse } from 'axios'
import { baseConfig, jsonConfig, formConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'user' })

export const searchUserByTextApi = (text: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getVerifyApi = (id: string) => {
  return request.get(`/verify/${id}`)
}

export const registerApi = (data: any) => {
  return request.post('/regist', data)
}

export const loginApi = (data: any) => {
  return request.post('/login', data)
}

export const securityApi = (data: any) => {
  return request.put('/security', data, {})
}

export const updateInfoApi = (data: any) => {
  return request.put('/update', data, jsonConfig())
}

export const getCurrentUserinfo = () => {
  return request.get('/info', baseConfig())
}

export const getUserInfoApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updatePasswordApi = (data: any) => {
  return request.put('/update/password', data, formConfig())
}

export const findPasswordApi = (data: any) => {
  return request.put('/security', data, formConfig())
}

export const updateUserLevelApi = (id: string, level: number) => {
  return request.put(`/update/level/${id}/${level}`, {}, baseConfig())
}

export const getAcRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/accept/rank/list?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const getLikeRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/like/rank?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const getUnlikeRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/unlike/rank?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const getCollectRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/collect/rank?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const getVisitRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/visit/rank?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const getHotRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/hot/rank/list?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const getScoreRankApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/score/rank/list?pageNum=${pageNum}&pageSize=${pageSize}`, baseConfig())
}

export const userRankApis: {
  [key: string]: () => Promise<AxiosResponse>
} = {
  getAcRankApi,
  getLikeRankApi,
  getUnlikeRankApi,
  getCollectRankApi,
  getVisitRankApi,
  getHotRankApi,
  getScoreRankApi,
}
