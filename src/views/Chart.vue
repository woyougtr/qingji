<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { showToast } from 'vant'
import { useUserStore, useWeightStore } from '@/stores'
import { getWeightTrend } from '@/api/weight'
import { formatWeight } from '@/utils'

const userStore = useUserStore()
const weightStore = useWeightStore()

const chartRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const activeTab = ref(7)
const tabs = [7, 30, 90, 365]

const trends = computed(() => weightStore.trends)

onMounted(async () => {
  await loadTrend()
})

watch(activeTab, () => {
  loadTrend()
})

async function loadTrend() {
  loading.value = true
  try {
    const data = await getWeightTrend(activeTab.value)
    weightStore.setTrends(data)
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="chart-page">
    <div class="page-header">
      <h1>趋势图表</h1>
    </div>

    <div class="tab-bar">
      <button
        v-for="days in tabs"
        :key="days"
        :class="['tab-item', { active: activeTab === days }]"
        @click="activeTab = days"
      >
        {{ days }}天
      </button>
    </div>

    <div class="chart-container">
      <div ref="chartRef" class="chart">
        <div v-if="loading" class="chart-loading">加载中...</div>
        <div v-else-if="trends.length === 0" class="chart-empty">
          暂无数据
        </div>
      </div>
    </div>

    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-label">最高</div>
        <div class="summary-value">
          {{ trends.length ? formatWeight(Math.max(...trends.map(t => t.weight)), userStore.settings.units) : '-' }}
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-label">最低</div>
        <div class="summary-value">
          {{ trends.length ? formatWeight(Math.min(...trends.map(t => t.weight)), userStore.settings.units) : '-' }}
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-label">平均</div>
        <div class="summary-value">
          {{ trends.length ? formatWeight(trends.reduce((a, b) => a + b.weight, 0) / trends.length, userStore.settings.units) : '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-page {
  padding: 16px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
}

.tab-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-item {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: var(--color-card);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
}

.tab-item.active {
  background: var(--color-primary);
  color: white;
}

.chart-container {
  background: var(--color-card);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.chart {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading,
.chart-empty {
  color: var(--color-text-secondary);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.summary-card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.summary-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
}
</style>