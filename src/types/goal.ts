export interface Goal {
  id: string
  userId: string
  targetWeight: number
  startWeight: number
  targetDate?: string
  status: 'active' | 'completed' | 'abandoned'
  createdAt: string
  completedAt?: string
}

export interface Milestone {
  id: string
  goalId: string
  weight: number
  label: string
  achievedAt?: string
}

export interface Achievement {
  id: string
  type: 'weight_lost_1kg' | 'weight_lost_5kg' | 'weight_lost_10kg' | 'streak_7' | 'streak_30' | 'first_record'
  value?: number
  achievedAt: string
}

export interface GoalProgress {
  goal: Goal
  currentWeight: number
  progress: number
  remainingWeight: number
  expectedDate?: string
  milestones: Milestone[]
}
