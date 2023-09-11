import axios from 'axios'
import { baseConfig, tagBaseUrl } from './baseConfig'
const request = axios.create({
  baseURL: `${tagBaseUrl}/tag`
})

export const createTagApi = (tag: string) => {
  return request.post(`/create/${tag}`)
}

export const createTagAutoApi = (text: string) => {
  return request.get(`/auto?text=${text}`, baseConfig())
}

export const getTagListApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}
