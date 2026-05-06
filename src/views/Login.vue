<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { useUserStore } from '@/stores'
import { login as loginApi } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    showToast('请输入邮箱和密码')
    return
  }

  loading.value = true
  try {
    const res = await loginApi({
      email: email.value,
      password: password.value,
    })
    
    userStore.setTokens(res.accessToken, res.refreshToken)
    userStore.setUser(res.user)
    
    showSuccessToast('登录成功')
    router.push('/')
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } }
    showToast(err.response?.data?.error || '登录失败')
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <div class="login-header">
      <h1>轻记</h1>
      <p>记录每一步，遇见更好的自己</p>
    </div>

    <div class="login-form">
      <div class="form-group">
        <label>邮箱</label>
        <input
          v-model="email"
          type="email"
          placeholder="请输入邮箱"
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          autocomplete="current-password"
        />
      </div>

      <button
        class="btn-primary login-btn"
        :disabled="loading"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <p class="register-link">
        还没有账号？<span @click="goToRegister">立即注册</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 60px 24px;
  background: var(--color-bg);
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.login-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.login-header p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.login-form {
  background: var(--color-card);
  border-radius: 16px;
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 16px;
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.register-link span {
  color: var(--color-primary);
  font-weight: 500;
}
</style>