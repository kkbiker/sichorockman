# YouTube視聴制限アプリ
「視聴ロックマン」


## 概要
見たいチャンネルをカテゴリに分け、視聴を制限する時間の指定することができるアプリ


## 各種画面
### ログイン画面
<img width="1512" height="858" alt="スクリーンショット 2025-07-11 10 54 20" src="https://github.com/user-attachments/assets/a1e9fb51-ddf3-432e-9aab-95d238e8a08f" />

### サインイン画面
<img width="1512" height="857" alt="スクリーンショット 2025-07-11 10 54 35" src="https://github.com/user-attachments/assets/0fd24a9c-2445-44b7-aa89-598bc33dd553" />

### ホーム画面
<img width="1512" height="860" alt="スクリーンショット 2025-07-11 10 56 22" src="https://github.com/user-attachments/assets/d9552016-058f-49b8-b05d-0efa0c5e4f85" />

### 動画視聴画面
<img width="1512" height="858" alt="スクリーンショット 2025-07-11 10 56 38" src="https://github.com/user-attachments/assets/4b3d0c43-d69a-42bf-9f52-d7df6cb9480c" />
<img width="1512" height="422" alt="スクリーンショット 2025-07-11 10 56 52" src="https://github.com/user-attachments/assets/9bf4eb31-1b2d-448d-9589-6dc1d2b7a49d" />

### チャンネル管理画面
<img width="1512" height="855" alt="スクリーンショット 2025-07-11 10 55 32" src="https://github.com/user-attachments/assets/ae902899-c215-468d-8062-51c1c92e1d75" />

### 時間制限画面
<img width="1512" height="858" alt="スクリーンショット 2025-07-11 10 55 51" src="https://github.com/user-attachments/assets/1b45698b-8282-4e13-8163-1e166dbdc5e2" />

### カテゴリ管理画面
<img width="1511" height="856" alt="スクリーンショット 2025-07-11 10 56 05" src="https://github.com/user-attachments/assets/38f7f868-500a-41a7-863e-f875c0af2183" />


## 起動手順
**1: 環境変数を指定** </br>
*/backend/.env.sample*を参考に </br>
*/backend/.env*に環境変数を設定 </br></br>
**YOUTUBE_API_KEY** (Google Cloud PlatformでYoutube Data API v3を発行、keyを指定) </br>
**JWT_KEY** (任意のjwt tokenを指定) </br></br>

**2: dockerを起動** </br>
下記コマンドをルートディレクトリで実行
```.sh
docker-compose up --build -d
```
終了時は下記コマンドを実行
```.sh
docker-compose down
```

下記URLにアクセス
```.sh
http://localhost:3000
```
