<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { showSuccessToast, showToast } from 'vant'
import { useUserStore, useWeightStore } from '@/stores'
import { formatWeight, formatDisplayDate } from '@/utils'
import { getWeights, getWeightStats } from '@/api/weight'

const userStore = useUserStore()
const weightStore = useWeightStore()

const loading = ref(false)

const records = computed(() => weightStore.sortedRecords)
const stats = computed(() => weightStore.stats)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    const [weightsData, statsData] = await Promise.all([
      getWeights({ pageSize: 100 }),
      getWeightStats(),
    ])
    weightStore.setRecords(weightsData.items)
    weightStore.setStats(statsData)
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

function getMoodEmoji(mood?: string): string {
  const moodMap: Record<string, string> = {
    great: '😄',
    good: '🙂',
    normal: '😐',
    bad: '😔',
  }
  return mood ? moodMap[mood] || '' : ''
}
</script>

<template>
  <div class="record-page">
    <div class="page-header">
      <h1>记录列表</h1>
    </div>

    <!-- 统计卡片 -->
    <div v-if="stats" class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ formatWeight(stats.currentWeight, userStore.settings.units) }}</div>
        <div class="stat-label">当前体重</div>
      </div>
      <div class="stat-card">
        <div class="stat-value success">{{ formatWeight(Math.abs(stats.totalLost), userStore.settings.units) }}</div>
        <div class="stat-label">累计减重</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.streakDays }}天</div>
        <div class="stat-label">连续记录</div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="record-list">
      <div v-for="record in records" :key="record.id" class="record-item">
        <div class="record-date">
          <div class="date-main">{{ formatDisplayDate(record.recordDate) }}</div>
          <div class="date-sub">{{ record.recordDate }}</div>
        </div>
        <div class="record-weight">
          <span class="weight-num">{{ formatWeight(record.weight, userStore.settings.units) }}</span>
          <span v-if="record.bodyFat" class="body-fat">体脂 {{ record.bodyFat }}%</span>
        </div>
        <div class="record-mood">
          <span v-if="record.mood">{{ getMoodEmoji(record.mood) }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="!loading && records.length === 0" class="empty">暂无记录</div>
  </div>
</template>

<style scoped>
.record-page {
  padding: 16px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.stat-value.success {
  color: var(--color-success);
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.record-list {
  background: var(--color-card);
  border-radius: 16px;
  overflow: hidden;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.record-item:last-child {
  border-bottom: none;
}

.record-date {
  flex: 1;
}

.date-main {
  font-size: 16px;
  font-weight: 500;
}

.date-sub {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.record-weight {
  text-align: right;
  margin-right: 12px;
}

.weight-num {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
}

.body-fat {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.record-mood {
  font-size: 24px;
}

.loading,
.empty {
  text-align: center;
  padding: 48px 16px;
  color: var(--color-text-secondary);
}
</style>