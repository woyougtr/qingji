<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, useWeightStore, useGoalStore } from '@/stores'
import { getRandomQuote, formatDisplayDate, formatWeight } from '@/utils'
import WeightInput from '@/components/weight/WeightInput.vue'
import DailyQuote from '@/components/motivational/DailyQuote.vue'

const router = useRouter()
const userStore = useUserStore()
const weightStore = useWeightStore()
const goalStore = useGoalStore()

const showWeightInput = ref(false)
const dailyQuote = ref(getRandomQuote())

const user = computed(() => userStore.user)
const stats = computed(() => weightStore.stats)
const goalProgress = computed(() => goalStore.goalProgress)

const progressPercent = computed(() => {
  if (!goalProgress.value) return 0
  return Math.min(100, Math.round(goalProgress.value.progress))
})

const weightDiff = computed(() => {
  if (!stats.value) return null
  const records = weightStore.sortedRecords
  if (records.length < 2) return null
  return records[0].weight - records[1].weight
})

onMounted(async () => {
  // 加载用户数据
  if (!userStore.user) {
    // await userStore.fetchUser()
  }
})

function openWeightInput() {
  showWeightInput.value = true
}

function closeWeightInput() {
  showWeightInput.value = false
}

function goToGoal() {
  router.push('/goal')
}
</script>

<template>
  <div class="home-page">
    <!-- 头部 -->
    <div class="header">
      <h1>轻记</h1>
      <p class="subtitle">{{ formatDisplayDate(new Date()) }}</p>
    </div>

    <!-- 每日激励 -->
    <DailyQuote :quote="dailyQuote" />

    <!-- 今日体重卡片 -->
    <div class="card today-card">
      <div class="card-header">
        <span class="icon i-mdi-scale-bathroom text-2xl text-emerald-500" />
        <h3>今日体重</h3>
      </div>
      
      <div v-if="weightStore.todayRecord" class="weight-display">
        <span class="weight-value">
          {{ formatWeight(weightStore.todayRecord.weight, userStore.settings.units) }}
        </span>
        <span v-if="weightDiff" class="weight-diff" :class="weightDiff < 0 ? 'down' : 'up'">
          {{ weightDiff < 0 ? '↓' : '↑' }} {{ formatWeight(Math.abs(weightDiff), userStore.settings.units) }}
        </span>
      </div>
      
      <div v-else class="no-record">
        <p>今天还没有记录体重哦</p>
        <button class="btn-primary" @click="openWeightInput">快速记录</button>
      </div>
    </div>

    <!-- 目标进度 -->
    <div v-if="goalProgress" class="card goal-card">
      <div class="card-header">
        <span class="icon i-mdi-target text-2xl text-blue-500" />
        <h3>目标进度</h3>
        <span class="view-more" @click="goToGoal">查看详情</span>
      </div>
      
      <div class="progress-info">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
        </div>
        <div class="progress-text">
          <span>{{ progressPercent }}%</span>
          <span>距离目标还差 {{ formatWeight(goalProgress.remainingWeight, userStore.settings.units) }}</span>
        </div>
      </div>
    </div>

    <!-- 快速记录弹窗 -->
    <WeightInput 
      v-if="showWeightInput" 
      @close="closeWeightInput"
    />
  </div>
</template>

<style scoped>
.home-page {
  padding: 16px;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
}

.header .subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.today-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.card-header .view-more {
  margin-left: auto;
  color: var(--color-primary);
  font-size: 14px;
}

.weight-display {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.weight-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary);
}

.weight-diff {
  font-size: 16px;
  padding: 4px 12px;
  border-radius: 8px;
}

.weight-diff.down {
  color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.weight-diff.up {
  color: var(--color-warning);
  background: rgba(245, 158, 11, 0.1);
}

.no-record {
  text-align: center;
}

.no-record p {
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.goal-card .progress-bar {
  height: 12px;
  background: var(--color-border);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.goal-card .progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 6px;
  transition: width 0.5s ease;
}

.goal-card .progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>