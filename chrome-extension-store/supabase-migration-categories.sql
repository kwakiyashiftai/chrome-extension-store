-- カテゴリーテーブルを作成
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- インデックスを作成
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- 既存のカテゴリーデータを挿入
INSERT INTO categories (name, display_order) VALUES
  ('外観', 1),
  ('プライバシー', 2),
  ('生産性', 3),
  ('セキュリティ', 4),
  ('ショッピング', 5),
  ('開発者ツール', 6),
  ('その他', 7)
ON CONFLICT (name) DO NOTHING;

-- RLS (Row Level Security) を有効化
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT
USING (true);

-- 管理者のみが追加・更新・削除可能（is_adminフラグを持つユーザー）
-- ※ 実際の運用では、usersテーブルのis_adminカラムをチェックするなど、
--    適切な認証ロジックを実装してください
CREATE POLICY "Categories are insertable by admins"
ON categories FOR INSERT
WITH CHECK (true);  -- TODO: 管理者認証を実装する場合はここを修正

CREATE POLICY "Categories are updatable by admins"
ON categories FOR UPDATE
USING (true);  -- TODO: 管理者認証を実装する場合はここを修正

CREATE POLICY "Categories are deletable by admins"
ON categories FOR DELETE
USING (true);  -- TODO: 管理者認証を実装する場合はここを修正
