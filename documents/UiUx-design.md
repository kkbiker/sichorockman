# UI/UX設計書 - 視聴ロックマン

## 画面一覧

### 1. 認証系画面

#### 1.1 ログイン画面
```
┌─────────────────────────────────────────┐
│                                         │
│           視聴ロックマン                 │
│                                         │
│    ┌─────────────────────────────────┐   │
│    │                                 │   │
│    │  Email                          │   │
│    │  [____________________]         │   │
│    │                                 │   │
│    │  Password                       │   │
│    │  [____________________]         │   │
│    │                                 │   │
│    │  [ ログイン ]                    │   │
│    │                                 │   │
│    │  アカウントをお持ちでない方は      │   │
│    │  → 新規登録                      │   │
│    │                                 │   │
│    └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**機能要件:**
- メールアドレスとパスワードでの認証
- 入力値バリデーション（リアルタイム）
- ログイン失敗時のエラーメッセージ表示
- 新規登録画面への遷移リンク
- パスワード表示/非表示切り替え

#### 1.2 ユーザー登録画面
```
┌─────────────────────────────────────────┐
│                                         │
│           新規ユーザー登録               │
│                                         │
│    ┌─────────────────────────────────┐   │
│    │                                 │   │
│    │  Email                          │   │
│    │  [____________________]         │   │
│    │                                 │   │
│    │  Password                       │   │
│    │  [____________________]         │   │
│    │                                 │   │
│    │  Password（確認）                │   │
│    │  [____________________]         │   │
│    │                                 │   │
│    │  [ 登録 ]                       │   │
│    │                                 │   │
│    │  既にアカウントをお持ちの方は      │   │
│    │  → ログイン                      │   │
│    │                                 │   │
│    └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**機能要件:**
- メールアドレスの重複チェック
- パスワード強度チェック
- パスワード確認の一致チェック
- 入力値バリデーション（リアルタイム）
- 登録完了後、自動ログイン
- ログイン画面への遷移リンク

### 2. メイン画面

#### 2.1 動画視聴画面（メイン）
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ヘッダー]                                                                   │
│ 視聴ロックマン            現在時刻: 14:30    アクティブ: 仕事カテゴリ    [設定] │
├─────────────────────────────────────────────────────────────────────────────┤
│ [サイドバー]              │ [メインエリア]                                   │
│                          │                                                 │
│ カテゴリ一覧              │ 検索バー                                         │
│ ┌─────────────────┐      │ [🔍________________]                            │
│ │ ✓ 仕事           │      │                                                 │
│ │   学習 (グレー)   │      │ 動画一覧                                         │
│ │   趣味 (グレー)   │      │ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │   リフレッシュ    │      │ │[サムネイル]│ │[サムネイル]│ │[サムネイル]│           │
│ │   (グレー)       │      │ │ タイトル   │ │ タイトル   │ │ タイトル   │           │
│ └─────────────────┘      │ │ チャンネル │ │ チャンネル │ │ チャンネル │           │
│                          │ │ 投稿日時   │ │ 投稿日時   │ │ 投稿日時   │           │
│                          │ └─────────┘ └─────────┘ └─────────┘           │
│                          │                                                 │
│                          │ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│                          │ │[サムネイル]│ │[サムネイル]│ │[サムネイル]│           │
│                          │ │ タイトル   │ │ タイトル   │ │ タイトル   │           │
│                          │ │ チャンネル │ │ チャンネル │ │ チャンネル │           │
│                          │ │ 投稿日時   │ │ 投稿日時   │ │ 投稿日時   │           │
│                          │ └─────────┘ └─────────┘ └─────────┘           │
│                          │                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ [フッター]                                                                   │
│ © 2025 視聴ロックマン                                        [設定] [ログアウト] │
└─────────────────────────────────────────────────────────────────────────────┘
```

**機能要件:**
- 現在時刻とアクティブカテゴリの表示
- 時間制限に応じたカテゴリのグレーアウト
- 動画の曖昧検索機能
- 動画カードのホバーエフェクト
- 無限スクロール対応
- レスポンシブデザイン

#### 2.2 動画再生画面
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ヘッダー]                                                                   │
│ 視聴ロックマン            現在時刻: 14:30    アクティブ: 仕事カテゴリ    [設定] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ [← 戻る]                                                                     │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                         │ │
│ │                    YouTube 埋め込み動画プレイヤー                        │ │
│ │                                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 動画タイトル                                                                 │
│ チャンネル名                                                                 │
│ 投稿日時                                                                     │
│                                                                             │
│ 関連動画 (同じチャンネルの他の動画)                                           │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                                       │
│ │[サムネイル]│ │[サムネイル]│ │[サムネイル]│                                       │
│ │ タイトル   │ │ タイトル   │ │ タイトル   │                                       │
│ └─────────┘ └─────────┘ └─────────┘                                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [フッター]                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**機能要件:**
- YouTube 埋め込み動画プレイヤー
- 動画情報の表示
- 関連動画の表示（同じチャンネルのみ）
- 動画一覧への戻るボタン

### 3. 設定画面

#### 3.1 設定画面（タブ形式）
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ヘッダー]                                                                   │
│ 視聴ロックマン - 設定                                          [← メインに戻る] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ [チャンネル管理] [時間制限設定] [カテゴリ管理]                                 │
│ ──────────────                                                             │
│                                                                             │
│ チャンネル検索                                                               │
│ [🔍 チャンネル名またはURLを入力________________] [検索]                        │
│                                                                             │
│ 登録済みチャンネル                                                           │
│                                                                             │
│ 【仕事カテゴリ】 (3/10)                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [アイコン] TechChannel     │ 技術系の動画チャンネル     │ [削除]         │ │
│ │ [アイコン] BusinessTube    │ ビジネス系の動画          │ [削除]         │ │
│ │ [アイコン] ProgrammingPro  │ プログラミング学習        │ [削除]         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 【学習カテゴリ】 (2/15)                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [アイコン] StudyChannel    │ 学習系の動画チャンネル     │ [削除]         │ │
│ │ [アイコン] EducationTube   │ 教育系の動画              │ [削除]         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [フッター]                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.2 チャンネル検索・登録画面
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ヘッダー]                                                                   │
│ 視聴ロックマン - チャンネル登録                              [← 設定に戻る] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ チャンネル検索                                                               │
│ [🔍 チャンネル名またはURLを入力________________] [検索]                        │
│                                                                             │
│ 検索結果                                                                     │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [サムネイル] Tech Channel                                                 │ │
│ │              技術系の動画を投稿しているチャンネル                          │ │
│ │              チャンネル登録者数: 10万人                                    │ │
│ │              動画数: 500本                                                 │ │
│ │              カテゴリ: [仕事 ▼]  [このチャンネルを登録]                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [サムネイル] Business Tube                                                │ │
│ │              ビジネス系の動画を投稿しているチャンネル                      │ │
│ │              チャンネル登録者数: 5万人                                     │ │
│ │              動画数: 300本                                                 │ │
│ │              カテゴリ: [仕事 ▼]  [このチャンネルを登録]                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [サムネイル] Programming Pro                                              │ │
│ │              プログラミング学習動画を投稿しているチャンネル                │ │
│ │              チャンネル登録者数: 15万人                                    │ │
│ │              動画数: 800本                                                 │ │
│ │              カテゴリ: [学習 ▼]  [このチャンネルを登録]                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [さらに表示]                                                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [フッター]                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**機能要件:**
- チャンネル名やURLでの検索機能
- 検索結果の詳細情報表示（登録者数、動画数など）
- カテゴリ選択ドロップダウン
- チャンネル登録の確認ダイアログ
- 登録上限チェック（カテゴリごとの制限）
- 重複登録チェック

#### 3.3 チャンネル登録確認ダイアログ
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                      ┌─────────────────────────────────┐                    │
│                      │ チャンネル登録確認               │                    │
│                      │                                 │                    │
│                      │ Tech Channel                    │                    │
│                      │ を「仕事」カテゴリに登録しますか？ │                    │
│                      │                                 │                    │
│                      │ 現在の登録数: 3/10              │                    │
│                      │                                 │                    │
│                      │ [キャンセル]     [登録する]      │                    │
│                      └─────────────────────────────────┘                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**機能要件:**
- チャンネル名とカテゴリの確認表示
- 現在の登録数表示
- 登録処理の実行
- 登録完了後のフィードバック

#### 3.4 時間制限設定タブ
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ヘッダー]                                                                   │
│ 視聴ロックマン - 設定                                          [← メインに戻る] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ [チャンネル管理] [時間制限設定] [カテゴリ管理]                                 │
│                 ──────────────                                             │
│                                                                             │
│ 時間制限設定                                                                 │
│                                                                             │
│ カテゴリ: [仕事 ▼]                                                          │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 曜日      │ 開始時間  │ 終了時間  │ 設定状態 │                           │ │
│ │──────────┼──────────┼──────────┼─────────┤                           │ │
│ │ 月曜日    │ 09:00    │ 18:00    │ 有効     │ [編集] [削除]            │ │
│ │ 火曜日    │ 09:00    │ 18:00    │ 有効     │ [編集] [削除]            │ │
│ │ 水曜日    │ 09:00    │ 18:00    │ 有効     │ [編集] [削除]            │ │
│ │ 木曜日    │ 09:00    │ 18:00    │ 有効     │ [編集] [削除]            │ │
│ │ 金曜日    │ 09:00    │ 18:00    │ 有効     │ [編集] [削除]            │ │
│ │ 土曜日    │ 設定なし  │ 設定なし  │ 無効     │ [追加]                  │ │
│ │ 日曜日    │ 設定なし  │ 設定なし  │ 無効     │ [追加]                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ [新しい時間制限を追加]                                                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [フッター]                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.3 カテゴリ管理タブ
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [ヘッダー]                                                                   │
│ 視聴ロックマン - 設定                                    [← メインに戻る] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ [チャンネル管理] [時間制限設定] [カテゴリ管理]                                 │
│                                 ──────────────                             │
│                                                                             │
│ カテゴリ管理                                                                 │
│                                                                             │
│ [新しいカテゴリを追加]                                                       │
│                                                                             │
│ 登録済みカテゴリ                                                             │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ カテゴリ名    │ チャンネル上限  │ 登録チャンネル数  │ 操作           │ │
│ │──────────────┼────────────────┼──────────────────┼───────────────┤ │
│ │ 仕事          │ 10             │ 3                │ [編集] [削除]  │ │
│ │ 学習          │ 15             │ 2                │ [編集] [削除]  │ │
│ │ 趣味          │ 20             │ 5                │ [編集] [削除]  │ │
│ │ リフレッシュ   │ 25             │ 8                │ [編集] [削除]  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [フッター]                                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## レスポンシブデザイン

### モバイル対応 (320px〜768px)
- サイドバーはハンバーガーメニュー化
- 動画カードは1列表示
- タブメニューはスクロール可能
- フッターは固定位置

### タブレット対応 (768px〜1024px)
- 動画カードは2列表示
- サイドバーは折りたたみ可能
- タブメニューは全表示

### デスクトップ対応 (1024px以上)
- 動画カードは3〜4列表示
- サイドバーは常時表示
- 全機能をフル表示

## 共通UI要素

### カラーパレット
```
プライマリー: #FF6B6B (赤系)
セカンダリー: #4ECDC4 (青緑系)
アクセント: #FFE66D (黄色系)
グレー: #95A5A6 (無効状態)
背景: #F8F9FA (ライトグレー)
テキスト: #2C3E50 (ダークグレー)
```

### フォント
```
ヘッダー: 'Noto Sans JP', sans-serif (Bold)
本文: 'Noto Sans JP', sans-serif (Regular)
サイズ: 16px (基本), 14px (小), 20px (大)
```

### アニメーション
```
ホバーエフェクト: 0.3s ease-in-out
ページ遷移: 0.5s slide
ローディング: スピナーアニメーション
```
