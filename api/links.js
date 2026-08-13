// 获取全部网址链接（需登录）
export async function onRequestGet({ request, env }) {
  const auth = await requireUser(request, env);
  if (!auth.ok) return auth.res;
  const rows = await env.DB.prepare('SELECT * FROM links ORDER BY created_at DESC').all();
  return json(200, { links: rows.results });
}

async function requireUser(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return { ok: false, res: json(401, { error: '未登录' }) };
  const userId = await env.SESSION_KV.get(m[1]);
  if (!userId) return { ok: false, res: json(401, { error: '未登录' }) };
  return { ok: true, userId };
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
