// 改密码接口：接收 {oldPassword, newPassword}
import bcrypt from 'bcryptjs';

export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) {
    return json(401, { error: '未登录' });
  }
  const userId = await env.SESSION_KV.get(m[1]);
  if (!userId) {
    return json(401, { error: '未登录' });
  }
  const { oldPassword, newPassword } = await request.json();
  if (!newPassword || newPassword.length < 6) {
    return json(400, { error: '新密码长度至少 6 位' });
  }
  const user = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?')
    .bind(userId)
    .first();
  const match = await bcrypt.compare(oldPassword, user.password_hash);
  if (!match) {
    return json(401, { error: '原密码错误' });
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    .bind(hash, userId)
    .run();
  return json(200, { ok: true });
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}