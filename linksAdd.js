// 添加网址（需登录）接收 {title, url, icon}
export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return json(401, { error: '未登录' });
  const userId = await env.SESSION_KV.get(m[1]);
  if (!userId) return json(401, { error: '未登录' });

  const { title, url, icon = '' } = await request.json();
  if (!title || !url) {
    return json(400, { error: '标题和地址不能为空' });
  }
  await env.DB.prepare('INSERT INTO links (title, url, icon) VALUES (?, ?, ?)')
    .bind(title, url, icon)
    .run();
  return json(201, { ok: true });
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}