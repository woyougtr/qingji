-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  height REAL,
  gender TEXT,
  birth_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 体重记录表
CREATE TABLE IF NOT EXISTS weight_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  weight REAL NOT NULL,
  body_fat REAL,
  bmi REAL,
  note TEXT,
  mood TEXT,
  record_date TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 目标表
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  target_weight REAL NOT NULL,
  start_weight REAL NOT NULL,
  target_date TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 里程碑表
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL,
  weight REAL NOT NULL,
  label TEXT,
  achieved_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES goals(id)
);

-- 成就表
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  value REAL,
  achieved_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 用户配置表
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  reminder_enabled INTEGER DEFAULT 1,
  reminder_time TEXT DEFAULT '20:00',
  theme TEXT DEFAULT 'light',
  units TEXT DEFAULT 'kg',
  language TEXT DEFAULT 'zh-CN',
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_weight_records_user_date ON weight_records(user_id, record_date);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);