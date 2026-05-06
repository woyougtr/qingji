import api from './index'
import type { Goal, GoalProgress, Milestone, Achievement } from '@/types'

export async function getGoals(): Promise<Goal[]> {
  const res = await api.get('/goals')
  return res.data
}

export async function getCurrentGoal(): Promise<Goal | null> {
  const res = await api.get('/goals/current')
  return res.data
}

export async function createGoal(data: {
  targetWeight: number
  startWeight: number
  targetDate?: string
}): Promise<Goal> {
  const res = await api.post('/goals', data)
  return res.data
}

export async function updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
  const res = await api.put(`/goals/${id}`, data)
  return res.data
}

export async function getGoalProgress(): Promise<GoalProgress | null> {
  const res = await api.get('/goals/progress')
  return res.data
}

export async function getMilestones(): Promise<Milestone[]> {
  const res = await api.get('/goals/milestones')
  return res.data
}

export async function getAchievements(): Promise<Achievement[]> {
  const res = await api.get('/goals/achievements')
  return res.data
}
