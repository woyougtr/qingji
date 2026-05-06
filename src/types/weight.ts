export interface WeightRecord {
  id: string
  userId: string
  weight: number
  bodyFat?: number
  bmi?: number
  note?: string
  mood?: 'great' | 'good' | 'normal' | 'bad'
  recordDate: string
  createdAt: string
}

export interface WeightStats {
  currentWeight: number
  startWeight: number
  lowestWeight: number
  highestWeight: number
  avgWeight: number
  totalLost: number
  daysRecorded: number
  streakDays: number
}

export interface WeightTrend {
  date: string
  weight: number
  bmi?: number
}
