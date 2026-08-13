-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 网址表
CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 预置管理员（name=Slaon, 密码部署后建议立即修改）
INSERT OR IGNORE INTO users (name, password_hash, role) VALUES ('Slaon', '$2b$10$rH3O0Xik0UjM8WYt9n7hxeC67uHDsLeQ26Qqp0GQX5w3j3bu/p2oO', 'admin');
