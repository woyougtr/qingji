<script setup lang="ts">
import { ref } from 'vue'
import { showSuccessToast, showToast } from 'vant'
import { useUserStore, useWeightStore } from '@/stores'
import { createWeight } from '@/api/weight'
import { formatWeight, parseWeight } from '@/utils'
import { formatDate } from '@/utils/date'

const emit = defineEmits<{
  close: []
}>()

const userStore = useUserStore()
const weightStore = useWeightStore()

const weight = ref('')
const bodyFat = ref('')
const note = ref('')
const recordDate = ref(formatDate(new Date()))
const loading = ref(false)

async function handleSubmit() {
  if (!weight.value) {
    showToast('请输入体重')
    return
  }

  loading.value = true
  try {
    const weightValue = parseWeight(Number(weight.value), userStore.settings.units)
    const record = await createWeight({
      weight: weightValue,
      bodyFat: bodyFat.value ? Number(bodyFat.value) : undefined,
      note: note.value,
      recordDate: recordDate.value,
    })
    
    weightStore.addRecord(record)
    showSuccessToast('记录成功')
    emit('close')
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } }
    showToast(err.response?.data?.error || '记录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="weight-input-modal">
    <div class="modal-overlay" @click="emit('close')"></div>
    <div class="modal-content">
      <h3>记录体重</h3>

      <div class="form-group">
        <label>体重 {{ userStore.settings.units === 'kg' ? '(kg)' : '(斤)' }}</label>
        <input
          v-model="weight"
          type="number"
          step="0.1"
          placeholder="输入体重"
        />
      </div>

      <div class="form-group">
        <label>体脂率 (%)</label>
        <input
          v-model="bodyFat"
          type="number"
          step="0.1"
          placeholder="可选"
        />
      </div>

      <div class="form-group">
        <label>日期</label>
        <input
          v-model="recordDate"
          type="date"
        />
      </div>

      <div class="form-group">
        <label>备注</label>
        <input
          v-model="note"
          type="text"
          placeholder="可选"
        />
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" @click="emit('close')">取消</button>
        <button class="btn-primary" :disabled="loading" @click="handleSubmit">
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weight-input-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: var(--color-card);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 360px;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
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
  border-radius: 12px;
  font-size: 16px;
  background: var(--color-bg);
  color: var(--color-text);
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
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