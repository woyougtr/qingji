<script setup lang="ts">
import { ref } from 'vue'
import { showDialog } from 'vant'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const user = userStore.user

function handleLogout() {
  showDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
  }).then(() => {
    userStore.logout()
    router.push('/login')
  }).catch(() => {})
}

function toggleUnits() {
  userStore.updateSettings({
    units: userStore.settings.units === 'kg' ? 'jin' : 'kg',
  })
}
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <h1>我的</h1>
    </div>

    <!-- 用户信息 -->
    <div class="user-card">
      <div class="avatar">
        <div class="i-mdi-account text-4xl text-white" />
      </div>
      <div class="user-info">
        <h2>{{ user?.nickname || '未登录' }}</h2>
        <p>{{ user?.email }}</p>
      </div>
    </div>

    <!-- 设置列表 -->
    <div class="settings-list">
      <div class="settings-item" @click="toggleUnits">
        <span class="i-mdi-scale text-xl text-emerald-500" />
        <span class="label">体重单位</span>
        <span class="value">{{ userStore.settings.units === 'kg' ? '公斤' : '斤' }}</span>
        <span class="i-mdi-chevron-right text-slate-400" />
      </div>

      <div class="settings-item">
        <span class="i-mdi-bell text-xl text-blue-500" />
        <span class="label">每日提醒</span>
        <span class="value">{{ userStore.settings.reminderTime }}</span>
        <span class="i-mdi-chevron-right text-slate-400" />
      </div>

      <div class="settings-item">
        <span class="i-mdi-theme-light-dark text-xl text-purple-500" />
        <span class="label">主题</span>
        <span class="value">{{ userStore.settings.theme === 'light' ? '浅色' : '深色' }}</span>
        <span class="i-mdi-chevron-right text-slate-400" />
      </div>
    </div>

    <!-- 退出登录 -->
    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>

<style scoped>
.profile-page {
  padding: 16px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 700;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-card);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-info p {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.settings-list {
  background: var(--color-card);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item .label {
  flex: 1;
  font-size: 16px;
}

.settings-item .value {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.logout-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 12px;
  background: var(--color-danger);
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}
</style>