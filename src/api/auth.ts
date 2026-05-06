import api from './index'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post('/auth/login', data)
  return res.data
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function refreshToken(token: string): Promise<{ accessToken: string }> {
  const res = await api.post('/auth/refresh', { refreshToken: token })
  return res.data
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me')
  return res.data
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const res = await api.put('/auth/profile', data)
  return res.data
}
