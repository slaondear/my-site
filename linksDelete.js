// 删除网址（需登录）接收 {id} 或 DELETE 请求
export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return json(401, { error: '未登录' });
  const userId = await env.SESSION_KV.get(m[1]);
  if (!userId) return json(401, { error: '未登录' });

  const { id } = await request.json();
  if (!id) return json(400, { error: '缺少 id' });
  await env.DB.prepare('DELETE FROM links WHERE id = ?').bind(id).run();
  return json(200, { ok: true });
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}