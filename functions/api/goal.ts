import { Hono } from 'hono'

const app = new Hono()

// 获取当前目标
app.get('/current', async (c) => {
  const userId = c.get('jwtPayload').userId
  const db = c.env.DB

  const goal = await db.prepare(`
    SELECT * FROM goals WHERE user_id = ? AND status = 'active' LIMIT 1
  `).bind(userId).first()

  return c.json(goal)
})

// 创建目标
app.post('/', async (c) => {
  const userId = c.get('jwtPayload').userId
  const { targetWeight, startWeight, targetDate } = await c.req.json()
  const db = c.env.DB

  // 先停用其他目标
  await db.prepare(`
    UPDATE goals SET status = 'abandoned' WHERE user_id = ? AND status = 'active'
  `).bind(userId).run()

  const id = crypto.randomUUID()
  await db.prepare(`
    INSERT INTO goals (id, user_id, target_weight, start_weight, target_date)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, userId, targetWeight, startWeight, targetDate).run()

  return c.json({
    id,
    userId,
    targetWeight,
    startWeight,
    targetDate,
    status: 'active',
    createdAt: new Date().toISOString(),
  })
})

// 获取目标进度
app.get('/progress', async (c) => {
  const userId = c.get('jwtPayload').userId
  const db = c.env.DB

  const goal = await db.prepare(`
    SELECT * FROM goals WHERE user_id = ? AND status = 'active' LIMIT 1
  `).bind(userId).first() as Record<string, unknown> | null

  if (!goal) {
    return c.json(null)
  }

  const latest = await db.prepare(`
    SELECT weight FROM weight_records WHERE user_id = ? ORDER BY record_date DESC LIMIT 1
  `).bind(userId).first() as Record<string, unknown> | null

  const currentWeight = latest?.weight || goal.start_weight
  const progress = (Number(goal.start_weight) - Number(currentWeight)) / (Number(goal.start_weight) - Number(goal.target_weight)) * 100
  const remainingWeight = Number(currentWeight) - Number(goal.target_weight)

  return c.json({
    goal,
    currentWeight,
    progress: Math.max(0, Math.min(100, progress)),
    remainingWeight: Math.max(0, remainingWeight),
  })
})

export default app