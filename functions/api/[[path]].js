export async function onRequest(context) {
  const { request, env } = context
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
  
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  const url = new URL(request.url)
  const path = url.pathname
  
  try {
    // 根路由
    if (path === '/api' || path === '/api/') {
      return new Response(JSON.stringify({ name: '轻记 API', status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // 注册
    if (path === '/api/auth/register' && request.method === 'POST') {
      const body = await request.json()
      const { email, password, nickname } = body
      const db = env.DB
      
      if (!email || !password || !nickname) {
        return new Response(JSON.stringify({ error: '请填写完整信息' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
      if (existing) {
        return new Response(JSON.stringify({ error: '邮箱已被注册' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const id = crypto.randomUUID()
      const passwordHash = await hashPassword(password)
      
      await db.prepare('INSERT INTO users (id, email, password_hash, nickname) VALUES (?, ?, ?, ?)')
        .bind(id, email, passwordHash, nickname).run()
      
      const token = createToken(id, env.JWT_SECRET)
      
      return new Response(JSON.stringify({
        user: { id, email, nickname },
        accessToken: token,
        refreshToken: token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // 登录
    if (path === '/api/auth/login' && request.method === 'POST') {
      const body = await request.json()
      const { email, password } = body
      const db = env.DB
      
      if (!email || !password) {
        return new Response(JSON.stringify({ error: '请输入邮箱和密码' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first()
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return new Response(JSON.stringify({ error: '邮箱或密码错误' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const token = createToken(user.id, env.JWT_SECRET)
      
      return new Response(JSON.stringify({
        user: { id: user.id, email: user.email, nickname: user.nickname },
        accessToken: token,
        refreshToken: token
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server Error: ' + String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword(password, hash) {
  return await hashPassword(password) === hash
}

function createToken(userId, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId, exp: Date.now() + 86400000 }))
  const signature = btoa(`${header}.${payload}.${secret}`)
  return `${header}.${payload}.${signature}`
}