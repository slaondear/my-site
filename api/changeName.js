// 改名接口：接收 {newName}
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
  const { newName } = await request.json();
  if (!newName) {
    return json(400, { error: '新用户名不能为空' });
  }
  try {
    await env.DB.prepare('UPDATE users SET name = ? WHERE id = ?')
      .bind(newName, userId)
      .run();
  } catch (e) {
    return json(409, { error: '用户名已存在' });
  }
  return json(200, { ok: true, name: newName });
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
