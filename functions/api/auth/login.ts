// Pages Function - 处理 /api/auth/login
export async function onRequestPost(context: any) {
  try {
    const { email, password } = await context.request.json()
    const db = context.env.DB
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: '请输入邮箱和密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first() as any
    if (!user || !(await verify(password, user.password_hash))) {
      return new Response(JSON.stringify({ error: '邮箱或密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const token = createToken(user.id, context.env.JWT_SECRET)
    return new Response(JSON.stringify({ 
      user: { id: user.id, email: user.email, nickname: user.nickname },
      accessToken: token,
      refreshToken: token
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Login error:', err)
    return new Response(JSON.stringify({ error: '登录失败: ' + String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function verify(password: string, hashStr: string): Promise<boolean> {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
  return hash === hashStr
}

function createToken(userId: string, secret: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }))
  const signature = btoa(`${header}.${payload}.${secret}`)
  return `${header}.${payload}.${signature}`
}