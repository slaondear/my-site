// 音乐列表：返回 /music 目录下预置的歌曲清单
// 歌曲文件直接放在仓库 music/ 文件夹，部署后可通过 /music/文件名 访问
// ponytail: 静态预置清单，若需动态管理音乐改存 D1/R2
export const SONG_MANIFEST = [
  // 示例（取消注释并放入文件即可用）：
  // { id: 1, title: '示例歌曲', artist: '歌手', src: '/music/song.mp3' }
];

export async function onRequestGet() {
  return new Response(JSON.stringify({ songs: SONG_MANIFEST }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}