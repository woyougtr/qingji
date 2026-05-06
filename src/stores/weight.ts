import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WeightRecord, WeightStats, WeightTrend } from '@/types'

export const useWeightStore = defineStore('weight', () => {
  const records = ref<WeightRecord[]>([])
  const stats = ref<WeightStats | null>(null)
  const trends = ref<WeightTrend[]>([])
  const loading = ref(false)

  const todayRecord = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return records.value.find(r => r.recordDate === today)
  })

  const sortedRecords = computed(() => {
    return [...records.value].sort((a, b) => 
      new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
    )
  })

  function setRecords(r: WeightRecord[]) {
    records.value = r
  }

  function addRecord(record: WeightRecord) {
    records.value.push(record)
  }

  function updateRecord(id: string, data: Partial<WeightRecord>) {
    const index = records.value.findIndex(r => r.id === id)
    if (index !== -1) {
      records.value[index] = { ...records.value[index], ...data }
    }
  }

  function deleteRecord(id: string) {
    records.value = records.value.filter(r => r.id !== id)
  }

  function setStats(s: WeightStats) {
    stats.value = s
  }

  function setTrends(t: WeightTrend[]) {
    trends.value = t
  }

  return {
    records,
    stats,
    trends,
    loading,
    todayRecord,
    sortedRecords,
    setRecords,
    addRecord,
    updateRecord,
    deleteRecord,
    setStats,
    setTrends,
  }
})
