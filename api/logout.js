// 登出接口：删除 KV 会话并清除 Cookie
export async function onRequestPost({ request, env }) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)session=([^;]+)/);
  if (m) {
    await env.SESSION_KV.delete(m[1]);
  }
  const res = json(200, { ok: true });
  res.headers.set(
    'Set-Cookie',
    `session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
  return res;
}

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
