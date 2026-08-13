// 注册接口：接收 {name, password}
import bcrypt from 'bcryptjs';

export async function onRequestPost({ request, env }) {
  try {
    const { name, password } = await request.json();
    if (!name || !password) {
      return json(400, { error: '用户名和密码不能为空' });
    }
    if (password.length < 6) {
      return json(400, { error: '密码长度至少 6 位' });
    }
    const hash = await bcrypt.hash(password, 10);
    try {
      await env.DB.prepare('INSERT INTO users (name, password_hash) VALUES (?, ?)')
        .bind(name, hash)
        .run();
    } catch (e) {
      // UNIQUE 约束冲突
      return json(409, { error: '用户名已存在' });
    }
    return json(201, { ok: true });
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
