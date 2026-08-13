// 查询当前登录用户
export async function onRequestGet({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) {
    return json(401, { error: '未登录' });
  }
  const userId = await env.SESSION_KV.get(m[1]);
  if (!userId) {
    return json(401, { error: '未登录' });
  }
  const user = await env.DB.prepare('SELECT id, name, role FROM users WHERE id = ?')
    .bind(userId)
    .first();
  if (!user) {
    return json(401, { error: '用户不存在' });
  }
  return json(200, { id: user.id, name: user.name, role: user.role });
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
