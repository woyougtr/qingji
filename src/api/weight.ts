import api from './index'
import type { WeightRecord, WeightStats, WeightTrend, PaginatedResponse } from '@/types'

export async function getWeights(params?: {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}): Promise<PaginatedResponse<WeightRecord>> {
  const res = await api.get('/weights', { params })
  return res.data
}

export async function createWeight(data: {
  weight: number
  bodyFat?: number
  note?: string
  mood?: string
  recordDate: string
}): Promise<WeightRecord> {
  const res = await api.post('/weights', data)
  return res.data
}

export async function updateWeight(id: string, data: Partial<WeightRecord>): Promise<WeightRecord> {
  const res = await api.put(`/weights/${id}`, data)
  return res.data
}

export async function deleteWeight(id: string): Promise<void> {
  await api.delete(`/weights/${id}`)
}

export async function getWeightStats(): Promise<WeightStats> {
  const res = await api.get('/weights/stats')
  return res.data
}

export async function getWeightTrend(days: number = 30): Promise<WeightTrend[]> {
  const res = await api.get('/weights/trend', { params: { days } })
  return res.data
}
