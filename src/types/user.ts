export interface User {
  id: string
  email: string
  nickname: string
  avatarUrl?: string
  height?: number
  gender?: 'male' | 'female'
  birthDate?: string
  createdAt: string
}

export interface UserSettings {
  units: 'kg' | 'jin'
  reminderEnabled: boolean
  reminderTime: string
  theme: 'light' | 'dark' | 'auto'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}
