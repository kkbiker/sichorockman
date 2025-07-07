# データベース設計

## テーブル構成

### ユーザー管理

#### users
| カラム名 | データ型 | 制約 | 説明 |
|:---------|:---------|:-----|:-----|
| id | SERIAL | PRIMARY KEY | ユーザーID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | メールアドレス |
| password_hash | VARCHAR(255) | NOT NULL | パスワードハッシュ |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 更新日時 |

### カテゴリ管理

#### categories
| カラム名 | データ型 | 制約 | 説明 |
|:---------|:---------|:-----|:-----|
| id | SERIAL | PRIMARY KEY | カテゴリID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY (users.id) | ユーザーID |
| name | VARCHAR(100) | NOT NULL | カテゴリ名 |
| channel_limit | INTEGER | NOT NULL DEFAULT 10 | チャンネル登録上限数 |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |

### チャンネル管理

#### channels
| カラム名 | データ型 | 制約 | 説明 |
|:---------|:---------|:-----|:-----|
| id | SERIAL | PRIMARY KEY | チャンネルID |
| youtube_channel_id | VARCHAR(255) | NOT NULL, UNIQUE | YouTube チャンネルID |
| name | VARCHAR(255) | NOT NULL | チャンネル名 |
| description | TEXT | | チャンネル説明 |
| thumbnail_url | VARCHAR(500) | | サムネイル画像URL |

#### user_channels
| カラム名 | データ型 | 制約 | 説明 |
|:---------|:---------|:-----|:-----|
| id | SERIAL | PRIMARY KEY | ユーザーチャンネルID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY (users.id) | ユーザーID |
| channel_id | INTEGER | NOT NULL, FOREIGN KEY (channels.id) | チャンネルID |
| category_id | INTEGER | NOT NULL, FOREIGN KEY (categories.id) | カテゴリID |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |

### 時間制限設定

#### time_restrictions
| カラム名 | データ型 | 制約 | 説明 |
|:---------|:---------|:-----|:-----|
| id | SERIAL | PRIMARY KEY | 時間制限ID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY (users.id) | ユーザーID |
| category_id | INTEGER | NOT NULL, FOREIGN KEY (categories.id) | カテゴリID |
| day_of_week | INTEGER | NOT NULL | 曜日 (0:日曜日, 1:月曜日, ..., 6:土曜日) |
| start_time | TIME | NOT NULL | 開始時間 |
| end_time | TIME | NOT NULL | 終了時間 |

### 動画キャッシュ

#### video_cache
| カラム名 | データ型 | 制約 | 説明 |
|:---------|:---------|:-----|:-----|
| id | SERIAL | PRIMARY KEY | 動画キャッシュID |
| channel_id | INTEGER | NOT NULL, FOREIGN KEY (channels.id) | チャンネルID |
| youtube_video_id | VARCHAR(255) | NOT NULL | YouTube 動画ID |
| title | VARCHAR(500) | NOT NULL | 動画タイトル |
| published_at | TIMESTAMP | NOT NULL | 公開日時 |
| cached_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | キャッシュ日時 |

## インデックス

```sql
-- パフォーマンス向上のためのインデックス
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_user_channels_user_id ON user_channels(user_id);
CREATE INDEX idx_user_channels_category_id ON user_channels(category_id);
CREATE INDEX idx_time_restrictions_user_id ON time_restrictions(user_id);
CREATE INDEX idx_time_restrictions_category_id ON time_restrictions(category_id);
CREATE INDEX idx_video_cache_channel_id ON video_cache(channel_id);
CREATE INDEX idx_video_cache_published_at ON video_cache(published_at DESC);
```

## 制約

```sql
-- 複合ユニーク制約
ALTER TABLE user_channels ADD CONSTRAINT unique_user_channel_category 
    UNIQUE (user_id, channel_id, category_id);

ALTER TABLE time_restrictions ADD CONSTRAINT unique_user_category_day 
    UNIQUE (user_id, category_id, day_of_week);
```
