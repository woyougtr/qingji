async function hash(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verify(password: string, hashString: string): Promise<boolean> {
  const passwordHash = await hash(password)
  return passwordHash === hashString
}

export { hash, verify }