<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navItems = [
  { name: 'Home', icon: 'i-mdi-home', label: '首页' },
  { name: 'Chart', icon: 'i-mdi-chart-line', label: '图表' },
  { name: 'Goal', icon: 'i-mdi-target', label: '目标' },
  { name: 'Profile', icon: 'i-mdi-account', label: '我的' },
]
</script>

<template>
  <nav class="bottom-nav">
    <div
      v-for="item in navItems"
      :key="item.name"
      class="nav-item"
      :class="{ active: route.name === item.name }"
      @click="router.push({ name: item.name })"
    >
      <div :class="item.icon" class="text-xl" />
      <span class="text-xs mt-1">{{ item.label }}</span>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(60px + var(--safe-area-bottom));
  padding-bottom: var(--safe-area-bottom);
  background: var(--color-card);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  color: var(--color-text-secondary);
  transition: color 0.2s;
  cursor: pointer;
}

.nav-item.active {
  color: var(--color-primary);
}
</style>
