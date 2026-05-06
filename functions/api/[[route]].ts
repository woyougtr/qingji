import { Hono } from 'hono'
import { cors } from 'hono/cors'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

// 根路由
app.get('/api', (c) => c.json({ name: '轻记 API', status: 'ok' }))

// 注册
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, nickname } = await c.req.json()
    const db = c.env.DB
    
    if (!email || !password || !nickname) {
      return c.json({ error: '请填写完整信息' }, 400)
    }
    
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) {
      return c.json({ error: '邮箱已被注册' }, 400)
    }

    const id = crypto.randomUUID()
    const passwordHash = await hash(password)
    
    await db.prepare('INSERT INTO users (id, email, password_hash, nickname) VALUES (?, ?, ?, ?)')
      .bind(id, email, passwordHash, nickname).run()

    const token = createToken(id, c.env.JWT_SECRET)
    return c.json({ 
      user: { id, email, nickname }, 
      accessToken: token,
      refreshToken: token 
    })
  } catch (err) {
    console.error('Register error:', err)
    return c.json({ error: '注册失败: ' + String(err) }, 500)
  }
})

// 登录
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    const db = c.env.DB
    
    if (!email || !password) {
      return c.json({ error: '请输入邮箱和密码' }, 400)
    }
    
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any
    if (!user || !(await verify(password, user.password_hash))) {
      return c.json({ error: '邮箱或密码错误' }, 401)
    }

    const token = createToken(user.id, c.env.JWT_SECRET)
    return c.json({ 
      user: { id: user.id, email: user.email, nickname: user.nickname },
      accessToken: token,
      refreshToken: token
    })
  } catch (err) {
    console.error('Login error:', err)
    return c.json({ error: '登录失败: ' + String(err) }, 500)
  }
})

async function hash(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verify(password: string, hashStr: string): Promise<boolean> {
  return await hash(password) === hashStr
}

function createToken(userId: string, secret: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }))
  const signature = btoa(`${header}.${payload}.${secret}`)
  return `${header}.${payload}.${signature}`
}

export default app