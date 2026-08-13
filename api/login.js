// 登录接口：接收 {name, password}，写入 KV 会话并设置 Cookie
import bcrypt from 'bcryptjs';

export async function onRequestPost({ request, env }) {
  try {
    const { name, password } = await request.json();
    const user = await env.DB.prepare('SELECT * FROM users WHERE name = ?')
      .bind(name)
      .first();
    if (!user) {
      return json(401, { error: '用户名或密码错误' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return json(401, { error: '用户名或密码错误' });
    }
    const token = crypto.randomUUID();
    await env.SESSION_KV.put(token, String(user.id), { expirationTtl: 604800 });
    const res = json(200, { ok: true, name: user.name, role: user.role });
    res.headers.set(
      'Set-Cookie',
      `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
    );
    return res;
  } catch (e) {
    return json(400, { error: '请求格式错误' });
  }
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
