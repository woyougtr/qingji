// Pages Function - 处理 /api/auth/register
export async function onRequestPost(context: any) {
  try {
    const { email, password, nickname } = await context.request.json()
    const db = context.env.DB
    
    if (!email || !password || !nickname) {
      return new Response(JSON.stringify({ error: '请填写完整信息' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
    if (existing) {
      return new Response(JSON.stringify({ error: '邮箱已被注册' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const id = crypto.randomUUID()
    const passwordHash = await hash(password)
    
    await db.prepare('INSERT INTO users (id, email, password_hash, nickname) VALUES (?, ?, ?, ?)')
      .bind(id, email, passwordHash, nickname).run()

    const token = createToken(id, context.env.JWT_SECRET)
    return new Response(JSON.stringify({ 
      user: { id, email, nickname }, 
      accessToken: token,
      refreshToken: token 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Register error:', err)
    return new Response(JSON.stringify({ error: '注册失败: ' + String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function hash(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function createToken(userId: string, secret: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }))
  const signature = btoa(`${header}.${payload}.${secret}`)
  return `${header}.${payload}.${signature}`
}