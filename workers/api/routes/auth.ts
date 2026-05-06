import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { hash, verify } from '../services/auth'

const app = new Hono()

// 注册
app.post('/register', async (c) => {
  const { email, password, nickname } = await c.req.json()
  const db = c.env.DB

  // 检查邮箱是否已存在
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) {
    return c.json({ error: '邮箱已被注册' }, 400)
  }

  // 创建用户
  const id = crypto.randomUUID()
  const passwordHash = await hash(password)
  
  await db.prepare(`
    INSERT INTO users (id, email, password_hash, nickname)
    VALUES (?, ?, ?, ?)
  `).bind(id, email, passwordHash, nickname).run()

  // 创建默认设置
  await db.prepare(`
    INSERT INTO user_settings (user_id) VALUES (?)
  `).bind(id).run()

  // 生成 token
  const accessToken = await sign({ userId: id, exp: Math.floor(Date.now() / 1000) + 900 }, c.env.JWT_SECRET)
  const refreshToken = await sign({ userId: id, type: 'refresh', exp: Math.floor(Date.now() / 1000) + 2592000 }, c.env.JWT_SECRET)

  return c.json({
    user: { id, email, nickname },
    accessToken,
    refreshToken,
  })
})

// 登录
app.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const db = c.env.DB

  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
  if (!user) {
    return c.json({ error: '邮箱或密码错误' }, 401)
  }

  const valid = await verify(password, user.password_hash)
  if (!valid) {
    return c.json({ error: '邮箱或密码错误' }, 401)
  }

  const accessToken = await sign({ userId: user.id, exp: Math.floor(Date.now() / 1000) + 900 }, c.env.JWT_SECRET)
  const refreshToken = await sign({ userId: user.id, type: 'refresh', exp: Math.floor(Date.now() / 1000) + 2592000 }, c.env.JWT_SECRET)

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarUrl: user.avatar_url,
      height: user.height,
      gender: user.gender,
    },
    accessToken,
    refreshToken,
  })
})

// 获取当前用户
app.get('/me', async (c) => {
  const userId = c.get('jwtPayload').userId
  const db = c.env.DB

  const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
  if (!user) {
    return c.json({ error: '用户不存在' }, 404)
  }

  return c.json({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatarUrl: user.avatar_url,
    height: user.height,
    gender: user.gender,
  })
})

export default app