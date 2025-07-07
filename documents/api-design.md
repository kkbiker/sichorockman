# API設計書

## 概要

RESTful API設計に基づいた、視聴ロックマン のバックエンドAPI仕様書

**Base URL:** `http://localhost:8080/api/v1`

## 認証

JWT（JSON Web Token）を使用した認証方式

### 認証ヘッダー
```
Authorization: Bearer {JWT_TOKEN}
```

## 共通レスポンス形式

### 成功時
```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "Success"
}
```

### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細なエラー情報"
  }
}
```

## 1. 認証API

### 1.1 ユーザー登録
```http
POST /auth/register
```

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2025-07-04T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "ユーザー登録が完了しました"
}
```

### 1.2 ログイン
```http
POST /auth/login
```

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "ログインが完了しました"
}
```

### 1.3 ログアウト
```http
POST /auth/logout
```

**ヘッダー:** `Authorization: Bearer {token}`

**レスポンス:**
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

## 2. カテゴリ管理API

### 2.1 カテゴリ一覧取得
```http
GET /categories
```

**ヘッダー:** `Authorization: Bearer {token}`

**レスポンス:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "仕事",
      "channelLimit": 10,
      "channelCount": 3,
      "createdAt": "2025-07-04T10:00:00Z"
    },
    {
      "id": 2,
      "name": "学習",
      "channelLimit": 15,
      "channelCount": 2,
      "createdAt": "2025-07-04T10:00:00Z"
    }
  ]
}
```

### 2.2 カテゴリ作成
```http
POST /categories
```

**ヘッダー:** `Authorization: Bearer {token}`

**リクエスト:**
```json
{
  "name": "趣味",
  "channelLimit": 20
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "趣味",
    "channelLimit": 20,
    "channelCount": 0,
    "createdAt": "2025-07-04T10:00:00Z"
  },
  "message": "カテゴリが作成されました"
}
```

### 2.3 カテゴリ更新
```http
PUT /categories/{categoryId}
```

**ヘッダー:** `Authorization: Bearer {token}`

**リクエスト:**
```json
{
  "name": "趣味・娯楽",
  "channelLimit": 25
}
```

### 2.4 カテゴリ削除
```http
DELETE /categories/{categoryId}
```

**ヘッダー:** `Authorization: Bearer {token}`

## 3. チャンネル管理API

### 3.1 チャンネル検索
```http
GET /channels/search?q={query}
```

**ヘッダー:** `Authorization: Bearer {token}`

**パラメータ:**
- `q`: 検索クエリ（チャンネル名またはURL）

**レスポンス:**
```json
{
  "success": true,
  "data": [
    {
      "youtubeChannelId": "UC1234567890",
      "name": "TechChannel",
      "description": "技術系の動画を配信しています",
      "thumbnailUrl": "https://yt3.ggpht.com/...",
      "subscriberCount": 10000,
      "videoCount": 150
    }
  ]
}
```

### 3.2 ユーザーの登録チャンネル一覧
```http
GET /user-channels
```

**ヘッダー:** `Authorization: Bearer {token}`

**パラメータ:**
- `categoryId` (optional): カテゴリでフィルタリング

**レスポンス:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "channel": {
        "id": 1,
        "youtubeChannelId": "UC1234567890",
        "name": "TechChannel",
        "description": "技術系の動画を配信しています",
        "thumbnailUrl": "https://yt3.ggpht.com/..."
      },
      "category": {
        "id": 1,
        "name": "仕事"
      },
      "createdAt": "2025-07-04T10:00:00Z"
    }
  ]
}
```

### 3.3 チャンネル登録
```http
POST /user-channels
```

**ヘッダー:** `Authorization: Bearer {token}`

**リクエスト:**
```json
{
  "youtubeChannelId": "UC1234567890",
  "categoryId": 1
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "channel": {
      "id": 1,
      "youtubeChannelId": "UC1234567890",
      "name": "TechChannel",
      "description": "技術系の動画を配信しています",
      "thumbnailUrl": "https://yt3.ggpht.com/..."
    },
    "category": {
      "id": 1,
      "name": "仕事"
    },
    "createdAt": "2025-07-04T10:00:00Z"
  },
  "message": "チャンネルが登録されました"
}
```

### 3.4 チャンネル登録解除
```http
DELETE /user-channels/{userChannelId}
```

**ヘッダー:** `Authorization: Bearer {token}`

## 4. 動画API

### 4.1 動画一覧取得
```http
GET /videos
```

**ヘッダー:** `Authorization: Bearer {token}`

**パラメータ:**
- `categoryId` (optional): カテゴリでフィルタリング
- `q` (optional): 検索クエリ
- `page` (optional): ページ番号 (default: 1)
- `limit` (optional): 取得件数 (default: 20)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "dQw4w9WgXcQ",
        "title": "React入門講座",
        "description": "Reactの基本的な使い方を解説します",
        "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        "publishedAt": "2025-07-03T10:00:00Z",
        "duration": "PT15M30S",
        "channel": {
          "id": 1,
          "name": "TechChannel",
          "thumbnailUrl": "https://yt3.ggpht.com/..."
        },
        "category": {
          "id": 1,
          "name": "仕事"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 4.2 動画詳細取得
```http
GET /videos/{videoId}
```

**ヘッダー:** `Authorization: Bearer {token}`

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "dQw4w9WgXcQ",
    "title": "React入門講座",
    "description": "Reactの基本的な使い方を解説します...",
    "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "publishedAt": "2025-07-03T10:00:00Z",
    "duration": "PT15M30S",
    "viewCount": 1000,
    "likeCount": 50,
    "channel": {
      "id": 1,
      "name": "TechChannel",
      "thumbnailUrl": "https://yt3.ggpht.com/..."
    },
    "category": {
      "id": 1,
      "name": "仕事"
    },
    "relatedVideos": [
      {
        "id": "abc123",
        "title": "JavaScript基礎",
        "thumbnailUrl": "https://i.ytimg.com/vi/abc123/maxresdefault.jpg",
        "publishedAt": "2025-07-02T10:00:00Z"
      }
    ]
  }
}
```

## 5. 時間制限API

### 5.1 時間制限設定一覧取得
```http
GET /time-restrictions
```

**ヘッダー:** `Authorization: Bearer {token}`

**パラメータ:**
- `categoryId` (optional): カテゴリでフィルタリング

**レスポンス:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category": {
        "id": 1,
        "name": "仕事"
      },
      "dayOfWeek": 1,
      "dayOfWeekName": "月曜日",
      "startTime": "09:00",
      "endTime": "18:00"
    }
  ]
}
```

### 5.2 時間制限設定作成
```http
POST /time-restrictions
```

**ヘッダー:** `Authorization: Bearer {token}`

**リクエスト:**
```json
{
  "categoryId": 1,
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "18:00"
}
```

### 5.3 時間制限設定更新
```http
PUT /time-restrictions/{restrictionId}
```

**ヘッダー:** `Authorization: Bearer {token}`

**リクエスト:**
```json
{
  "startTime": "10:00",
  "endTime": "17:00"
}
```

### 5.4 時間制限設定削除
```http
DELETE /time-restrictions/{restrictionId}
```

**ヘッダー:** `Authorization: Bearer {token}`

### 5.5 現在の時間制限状態取得
```http
GET /time-restrictions/current
```

**ヘッダー:** `Authorization: Bearer {token}`

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "currentTime": "2025-07-04T14:30:00Z",
    "currentDayOfWeek": 5,
    "activeCategories": [
      {
        "id": 1,
        "name": "仕事",
        "isActive": true,
        "restriction": {
          "startTime": "09:00",
          "endTime": "18:00"
        }
      },
      {
        "id": 2,
        "name": "学習",
        "isActive": false,
        "restriction": null
      }
    ]
  }
}
```

## 6. YouTube API連携

### 6.1 YouTube API使用状況取得
```http
GET /youtube/quota
```

**ヘッダー:** `Authorization: Bearer {token}`

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "dailyQuota": 10000,
    "usedQuota": 2500,
    "remainingQuota": 7500,
    "resetTime": "2025-07-05T00:00:00Z"
  }
}
```

### 6.2 動画キャッシュ更新
```http
POST /youtube/refresh-cache
```

**ヘッダー:** `Authorization: Bearer {token}`

**リクエスト:**
```json
{
  "channelIds": [1, 2, 3]
}
```

## エラーコード一覧

| コード | 説明 |
|:------|:-----|
| VALIDATION_ERROR | 入力値バリデーションエラー |
| UNAUTHORIZED | 認証エラー |
| FORBIDDEN | 権限エラー |
| NOT_FOUND | リソースが見つからない |
| DUPLICATE_EMAIL | メールアドレスが既に登録済み |
| INVALID_CREDENTIALS | ログイン認証情報が無効 |
| CHANNEL_LIMIT_EXCEEDED | チャンネル登録上限超過 |
| YOUTUBE_API_ERROR | YouTube API呼び出しエラー |
| QUOTA_EXCEEDED | YouTube API クォータ超過 |
| TIME_RESTRICTION_ACTIVE | 時間制限により視聴不可 |
| INTERNAL_SERVER_ERROR | サーバー内部エラー |

## レート制限

| エンドポイント | 制限 |
|:-------------|:-----|
| 認証API | 10回/分 |
| 検索API | 30回/分 |
| その他API | 100回/分 |

## セキュリティ

### CORS設定
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### JWT設定
```
有効期限: 24時間
更新: 12時間以内に自動更新
暗号化: HS256
```

### 入力値検証
- メールアドレス: RFC 5322準拠
- パスワード: 8文字以上、英数字含む
- URL: YouTube URL形式チェック
- 時間: HH:MM形式チェック
