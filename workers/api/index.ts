import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'
import authRoutes from './routes/auth'
import weightRoutes from './routes/weight'
import goalRoutes from './routes/goal'

async function verifyToken(token: string, secret: string) {
  return await verify(token, secret, 'HS256')
}

const app = new Hono()

app.use('*', cors())

// 根路由 - API 状态检查
app.get('/', (c) => {
  return c.json({
    name: '轻记 API',
    version: '1.0.0',
    status: 'ok',
    endpoints: {
      auth: '/auth',
      weights: '/weights',
      goals: '/goals',
    }
  })
})

// 公开路由
app.route('/auth', authRoutes)

// JWT 保护路由 - 添加错误处理
app.use('/weights/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '缺少认证令牌' }, 401)
  }
  
  const token = authHeader.slice(7)
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    c.set('jwtPayload', payload)
    await next()
  } catch (err) {
    console.error('JWT verify error:', err)
    return c.json({ error: '令牌无效或已过期' }, 401)
  }
})

app.use('/goals/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '缺少认证令牌' }, 401)
  }
  
  const token = authHeader.slice(7)
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET)
    c.set('jwtPayload', payload)
    await next()
  } catch (err) {
    return c.json({ error: '令牌无效或已过期' }, 401)
  }
})

app.route('/weights', weightRoutes)
app.route('/goals', goalRoutes)

// 全局错误处理
app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: '服务器错误: ' + err.message }, 500)
})

export default app