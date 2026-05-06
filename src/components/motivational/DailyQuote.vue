<script setup lang="ts">
defineProps<{
  quote: string
}>()
</script>

<template>
  <div class="daily-quote">
    <div class="quote-icon i-mdi-lightbulb text-2xl text-yellow-500" />
    <p class="quote-text">{{ quote }}</p>
  </div>
</template>

<style scoped>
.daily-quote {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.quote-text {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.5;
}
</style>