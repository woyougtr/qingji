import { Hono } from 'hono'

const app = new Hono()

// 获取体重记录列表
app.get('/', async (c) => {
  const userId = c.get('jwtPayload').userId
  const { page = 1, pageSize = 30 } = c.req.query()
  const db = c.env.DB

  const offset = (Number(page) - 1) * Number(pageSize)
  
  const records = await db.prepare(`
    SELECT * FROM weight_records 
    WHERE user_id = ? 
    ORDER BY record_date DESC 
    LIMIT ? OFFSET ?
  `).bind(userId, Number(pageSize), offset).all()

  const count = await db.prepare(`
    SELECT COUNT(*) as total FROM weight_records WHERE user_id = ?
  `).bind(userId).first()

  return c.json({
    items: records.results.map((r: Record<string, unknown>) => ({
      id: r.id,
      weight: r.weight,
      bodyFat: r.body_fat,
      bmi: r.bmi,
      note: r.note,
      mood: r.mood,
      recordDate: r.record_date,
      createdAt: r.created_at,
    })),
    total: count?.total || 0,
    page: Number(page),
    pageSize: Number(pageSize),
  })
})

// 创建体重记录
app.post('/', async (c) => {
  const userId = c.get('jwtPayload').userId
  const { weight, bodyFat, note, mood, recordDate } = await c.req.json()
  const db = c.env.DB

  let bmi = null
  const user = await db.prepare('SELECT height FROM users WHERE id = ?').bind(userId).first() as Record<string, unknown>
  if (user?.height) {
    const heightM = Number(user.height) / 100
    bmi = Math.round((weight / (heightM * heightM)) * 10) / 10
  }

  const id = crypto.randomUUID()
  await db.prepare(`
    INSERT INTO weight_records (id, user_id, weight, body_fat, bmi, note, mood, record_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, userId, weight, bodyFat, bmi, note, mood, recordDate).run()

  return c.json({
    id,
    weight,
    bodyFat,
    bmi,
    note,
    mood,
    recordDate,
    createdAt: new Date().toISOString(),
  })
})

// 删除体重记录
app.delete('/:id', async (c) => {
  const userId = c.get('jwtPayload').userId
  const { id } = c.req.param()
  const db = c.env.DB

  await db.prepare(`
    DELETE FROM weight_records WHERE id = ? AND user_id = ?
  `).bind(id, userId).run()

  return c.json({ success: true })
})

// 获取统计数据
app.get('/stats', async (c) => {
  const userId = c.get('jwtPayload').userId
  const db = c.env.DB

  const stats = await db.prepare(`
    SELECT 
      (SELECT weight FROM weight_records WHERE user_id = ? ORDER BY record_date DESC LIMIT 1) as current_weight,
      (SELECT weight FROM weight_records WHERE user_id = ? ORDER BY record_date ASC LIMIT 1) as start_weight,
      MIN(weight) as lowest_weight,
      MAX(weight) as highest_weight,
      AVG(weight) as avg_weight,
      COUNT(*) as days_recorded
    FROM weight_records 
    WHERE user_id = ?
  `).bind(userId, userId, userId).first()

  return c.json({
    currentWeight: stats?.current_weight || 0,
    startWeight: stats?.start_weight || 0,
    lowestWeight: stats?.lowest_weight || 0,
    highestWeight: stats?.highest_weight || 0,
    avgWeight: Math.round(Number(stats?.avg_weight || 0) * 10) / 10,
    totalLost: Number(stats?.start_weight || 0) - Number(stats?.current_weight || 0),
    daysRecorded: stats?.days_recorded || 0,
    streakDays: 0,
  })
})

export default app