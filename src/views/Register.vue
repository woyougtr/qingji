<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import { register as registerApi } from '@/api/auth'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const nickname = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!email.value || !password.value || !nickname.value) {
    showToast('请填写完整信息')
    return
  }

  if (password.value !== confirmPassword.value) {
    showToast('两次密码不一致')
    return
  }

  if (password.value.length < 6) {
    showToast('密码至少6位')
    return
  }

  loading.value = true
  try {
    const res = await registerApi({
      email: email.value,
      password: password.value,
      nickname: nickname.value,
    })
    
    userStore.setTokens(res.accessToken, res.refreshToken)
    userStore.setUser(res.user)
    
    showSuccessToast('注册成功')
    router.push('/')
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } } }
    showToast(err.response?.data?.error || '注册失败')
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <div class="register-header">
      <h1>创建账号</h1>
      <p>开始你的健康之旅</p>
    </div>

    <div class="register-form">
      <div class="form-group">
        <label>昵称</label>
        <input
          v-model="nickname"
          type="text"
          placeholder="给自己取个名字"
        />
      </div>

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
          placeholder="至少6位密码"
          autocomplete="new-password"
        />
      </div>

      <div class="form-group">
        <label>确认密码</label>
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="再次输入密码"
          autocomplete="new-password"
        />
      </div>

      <button
        class="btn-primary register-btn"
        :disabled="loading"
        @click="handleRegister"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <p class="login-link">
        已有账号？<span @click="goToLogin">立即登录</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  padding: 40px 24px;
  background: var(--color-bg);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.register-header p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.register-form {
  background: var(--color-card);
  border-radius: 16px;
  padding: 24px;
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

.register-btn {
  width: 100%;
  margin-top: 8px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-link span {
  color: var(--color-primary);
  font-weight: 500;
}
</style>