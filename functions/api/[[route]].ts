import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'

export const onRequest: PagesFunction = async (context) => {
  const app = new Hono()

  app.use('*', cors())

  // 根路由
  app.get('/api', (c) => c.json({ name: '轻记 API', status: 'ok' }))

  // 简单的注册接口
  app.post('/api/auth/register', async (c) => {
    const { email, password, nickname } = await c.req.json()
    const db = context.env.DB
    
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) return c.json({ error: '邮箱已被注册' }, 400)

    const id = crypto.randomUUID()
    const passwordHash = await hash(password)
    
    await db.prepare('INSERT INTO users (id, email, password_hash, nickname) VALUES (?, ?, ?, ?)')
      .bind(id, email, passwordHash, nickname).run()

    const token = await createToken(id, context.env.JWT_SECRET)
    return c.json({ user: { id, email, nickname }, ...token })
  })

  // 登录
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json()
    const db = context.env.DB
    
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
    if (!user || !(await verify(password, user.password_hash))) {
      return c.json({ error: '邮箱或密码错误' }, 401)
    }

    const token = await createToken(user.id, context.env.JWT_SECRET)
    return c.json({ user: { id: user.id, email: user.email, nickname: user.nickname }, ...token })
  })

  return app.fetch(context.request, context.env)
}

async function hash(password: string) {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verify(password: string, hashStr: string) {
  return await hash(password) === hashStr
}

async function createToken(userId: string, secret: string) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }))
  const signature = btoa(`${header}.${payload}.${secret}`)
  return { accessToken: `${header}.${payload}.${signature}` }
}
