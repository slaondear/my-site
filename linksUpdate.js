// 编辑网址（需登录）接收 {id, title, url, icon}
export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return json(401, { error: '未登录' });
  const userId = await env.SESSION_KV.get(m[1]);
  if (!userId) return json(401, { error: '未登录' });

  const { id, title, url, icon = '' } = await request.json();
  if (!id || !title || !url) {
    return json(400, { error: '参数不完整' });
  }
  await env.DB.prepare('UPDATE links SET title = ?, url = ?, icon = ? WHERE id = ?')
    .bind(title, url, icon, id)
    .run();
  return json(200, { ok: true });
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}