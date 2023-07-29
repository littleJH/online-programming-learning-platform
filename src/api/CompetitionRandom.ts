import axios from 'axios'
import { baseConfig, baseURL, wsBaseUrl } from './baseConfig'
import { CompetitionType } from '@/vite-env'
const request = axios.create({
  baseURL: `${baseURL}/competition/random/`
})

export const enterRandomCompetitionApi = (type: CompetitionType) => {
  return request.post(`${type}/enter`, {}, baseConfig())
}

export const getRandomEnterConditionApi = (type: CompetitionType) => {
  return request.get(`${type}/enter/condition`, baseConfig())
}

export const cancelEnterRandomCompetitionApi = (type: CompetitionType) => {
  return request.delete(`${type}/cancel/enter`, baseConfig())
}

export const getEnterRandomCompetitionListApi = (type: CompetitionType) => {
  return request.get(`${type}/enter/list`)
}

export const enterPublishWs = () => {
  return new WebSocket(
    'ws://10.60.37.43:2000/competition/random/single/enter/publish'
  )
}
