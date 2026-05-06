import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import authRoutes from './routes/auth'
import weightRoutes from './routes/weight'
import goalRoutes from './routes/goal'

const app = new Hono()

app.use('*', cors())

// 公开路由
app.route('/auth', authRoutes)

// JWT 保护路由
app.use('/weights/*', jwt({ secret: c.env.JWT_SECRET }))
app.use('/goals/*', jwt({ secret: c.env.JWT_SECRET }))
app.use('/settings/*', jwt({ secret: c.env.JWT_SECRET }))

app.route('/weights', weightRoutes)
app.route('/goals', goalRoutes)

export default app