<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from '@/components/common/BottomNav.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showNav = computed(() => !['Login', 'Register'].includes(route.name as string))
</script>

<template>
  <div class="app-container">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
    <BottomNav v-if="showNav" />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding-bottom: calc(60px + var(--safe-area-bottom));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
