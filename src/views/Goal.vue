<script setup lang="ts">
import { ref, computed } from 'vue'
import { showDialog } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore, useGoalStore } from '@/stores'
import { formatWeight } from '@/utils'

const router = useRouter()
const userStore = useUserStore()
const goalStore = useGoalStore()

const user = computed(() => userStore.user)
const goal = computed(() => goalStore.currentGoal)
const progress = computed(() => goalStore.goalProgress)

const showSetGoal = ref(false)
const targetWeight = ref('')
const targetDate = ref('')

const progressPercent = computed(() => {
  if (!progress.value) return 0
  return Math.min(100, Math.round(progress.value.progress))
})

async function handleSetGoal() {
  if (!targetWeight.value) return
  
  // TODO: 调用 API 设置目标
  showSetGoal.value = false
}

function handleLogout() {
  showDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
  }).then(() => {
    userStore.logout()
    router.push('/login')
  }).catch(() => {})
}
</script>

<template>
  <div class="goal-page">
    <div class="page-header">
      <h1>我的目标</h1>
    </div>

    <!-- 目标进度 -->
    <div v-if="goal" class="goal-card">
      <div class="goal-header">
        <span class="i-mdi-target text-3xl text-emerald-500" />
        <h2>当前目标</h2>
      </div>
      
      <div class="progress-circle">
        <div class="circle-bg">
          <div class="circle-fill" :style="{ transform: `rotate(${progressPercent * 3.6}deg)` }" />
        </div>
        <div class="progress-text">
          <span class="percent">{{ progressPercent }}%</span>
          <span class="label">完成度</span>
        </div>
      </div>

      <div class="goal-info">
        <div class="info-item">
          <span class="label">起始体重</span>
          <span class="value">{{ formatWeight(goal.startWeight, userStore.settings.units) }}</span>
        </div>
        <div class="info-item">
          <span class="label">目标体重</span>
          <span class="value highlight">{{ formatWeight(goal.targetWeight, userStore.settings.units) }}</span>
        </div>
        <div v-if="progress" class="info-item">
          <span class="label">还需减重</span>
          <span class="value">{{ formatWeight(progress.remainingWeight, userStore.settings.units) }}</span>
        </div>
      </div>
    </div>

    <!-- 无目标提示 -->
    <div v-else class="no-goal">
      <div class="i-mdi-target text-6xl text-slate-300" />
      <p>还没有设定目标</p>
      <button class="btn-primary" @click="showSetGoal = true">设定目标</button>
    </div>

    <!-- 里程碑 -->
    <div v-if="goalStore.milestones.length" class="milestones">
      <h3>里程碑</h3>
      <div class="milestone-list">
        <div v-for="m in goalStore.milestones" :key="m.id" class="milestone-item">
          <div class="milestone-dot" :class="{ achieved: m.achievedAt }" />
          <div class="milestone-content">
            <span class="label">{{ m.label }}</span>
            <span class="value">{{ formatWeight(m.weight, userStore.settings.units) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 设定目标弹窗 -->
    <div v-if="showSetGoal" class="modal">
      <div class="modal-content">
        <h3>设定目标</h3>
        <div class="form-group">
          <label>目标体重</label>
          <input v-model="targetWeight" type="number" placeholder="输入目标体重" />
        </div>
        <div class="form-group">
          <label>目标日期（可选）</label>
          <input v-model="targetDate" type="date" />
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showSetGoal = false">取消</button>
          <button class="btn-primary" @click="handleSetGoal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.goal-page {
  padding: 16px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
}

.goal-card {
  background: var(--color-card);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.goal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.goal-header h2 {
  font-size: 18px;
  font-weight: 600;
}

.progress-circle {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 24px;
}

.circle-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(var(--color-primary) 0%, var(--color-border) 0%);
}

.circle-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(var(--color-primary) v-bind('progressPercent + "%"'), var(--color-border) v-bind('progressPercent + "%"'));
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.percent {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
  display: block;
}

.progress-text .label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.goal-info {
  display: flex;
  justify-content: space-around;
}

.info-item {
  text-align: center;
}

.info-item .label {
  display: block;
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 600;
}

.info-item .value.highlight {
  color: var(--color-primary);
}

.no-goal {
  text-align: center;
  padding: 48px 16px;
  background: var(--color-card);
  border-radius: 16px;
}

.no-goal p {
  margin: 16px 0;
  color: var(--color-text-secondary);
}

.milestones {
  background: var(--color-card);
  border-radius: 16px;
  padding: 16px;
}

.milestones h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.milestone-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-border);
}

.milestone-dot.achieved {
  background: var(--color-primary);
}

.milestone-content {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-content {
  background: var(--color-card);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 320px;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  background: var(--color-bg);
  color: var(--color-text);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
}
</style>