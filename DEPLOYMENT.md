# デプロイ手順書

このドキュメントでは、位置情報記録サービスを本番環境にデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料）
- Renderアカウント（無料）

---

## 手順1: GitHubにプロジェクトをアップロード

### 1-1. GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」→「New repository」
3. リポジトリ名: `location-tracker`（任意）
4. Public または Private を選択
5. 「Create repository」をクリック

### 1-2. ローカルプロジェクトをGitHubにプッシュ

```bash
cd /Users/soshinito/Desktop/location-tracker

# Gitの初期化
git init

# ファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Location Tracker App"

# GitHubリポジトリと接続（URLは自分のリポジトリに変更）
git remote add origin https://github.com/YOUR_USERNAME/location-tracker.git

# プッシュ
git branch -M main
git push -u origin main
```

---

## 手順2: バックエンドをRenderにデプロイ

### 2-1. Renderでデータベースを作成

1. [Render](https://render.com)にサインアップ/ログイン
2. ダッシュボードで「New +」→「PostgreSQL」
3. 以下を設定：
   - Name: `location-tracker-db`
   - Database: `location_tracker`
   - User: `location_tracker_user`
   - Region: 最寄りのリージョン（例: Singapore）
   - Instance Type: Free
4. 「Create Database」をクリック
5. **Internal Database URL**をコピー（後で使用）

### 2-2. Renderでバックエンドをデプロイ

1. Renderダッシュボードで「New +」→「Web Service」
2. 「Connect a repository」でGitHubと接続
3. `location-tracker`リポジトリを選択
4. 以下を設定：

| 項目 | 値 |
|------|-----|
| Name | `location-tracker-api` |
| Region | Singapore（データベースと同じ） |
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | Free |

5. 「Advanced」をクリックして環境変数を追加：

| Key | Value |
|-----|-------|
| `DATABASE_URL` | （先ほどコピーしたInternal Database URL） |
| `SECRET_KEY` | （ランダムな文字列、例: `your-super-secret-key-change-this-123456`） |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |

6. 「Create Web Service」をクリック
7. デプロイが完了するまで待つ（5-10分）
8. デプロイ完了後、**URLをコピー**（例: `https://location-tracker-api.onrender.com`）

---

## 手順3: フロントエンドをVercelにデプロイ

### 3-1. Vercelにデプロイ

1. [Vercel](https://vercel.com)にサインアップ/ログイン
2. 「Add New」→「Project」
3. GitHubリポジトリ `location-tracker` をインポート
4. 以下を設定：

| 項目 | 値 |
|------|-----|
| Project Name | `location-tracker` |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

5. 「Environment Variables」を追加：

| Name | Value |
|------|-------|
| `VITE_API_URL` | （RenderのバックエンドURL、例: `https://location-tracker-api.onrender.com`） |

6. 「Deploy」をクリック
7. デプロイ完了後、**URLをコピー**（例: `https://location-tracker.vercel.app`）

---

## 手順4: CORS設定の更新

バックエンドのCORS設定にVercelのURLを追加する必要があります。

### 4-1. ローカルでコードを修正

`backend/app/main.py`を開いて、CORS設定を更新：

```python
# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://location-tracker.vercel.app",  # ← あなたのVercel URLに変更
        "https://*.vercel.app"  # Vercelのプレビューデプロイ用
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4-2. GitHubにプッシュ

```bash
cd /Users/soshinito/Desktop/location-tracker
git add .
git commit -m "Update CORS settings for production"
git push
```

Renderが自動的に再デプロイします。

---

## 手順5: 動作確認

1. Vercelのフロントエンド URL（例: `https://location-tracker.vercel.app`）にアクセス
2. 新規登録してアカウント作成
3. ログイン
4. チェックインボタンを押す
5. 位置情報の許可を求められたら「許可」
6. チェックインが成功すれば完了！

---

## トラブルシューティング

### 問題1: バックエンドが起動しない

- Renderのログを確認：ダッシュボード → サービス → Logs
- 環境変数が正しく設定されているか確認

### 問題2: フロントエンドからAPIに接続できない

- `VITE_API_URL`が正しいか確認
- RenderのバックエンドURLが正しいか確認
- CORS設定が正しいか確認

### 問題3: データベース接続エラー

- RenderのPostgreSQLが起動しているか確認
- `DATABASE_URL`が正しいか確認

### 問題4: 位置情報が取得できない

- HTTPSでアクセスしているか確認（HTTPでは位置情報APIは動作しません）
- ブラウザの位置情報許可を確認

---

## 料金について

### 無料プラン

- **Vercel**: 月間100GBまで無料
- **Render**: PostgreSQL 90日間無料、Web Service 750時間/月無料

### 無料プランの制限

- RenderのWeb Serviceは15分間アクセスがないとスリープします
  - 初回アクセス時は起動に30秒〜1分かかります
- PostgreSQLは1GBまで無料

### 有料プランへのアップグレード

より安定したサービスが必要な場合：

- **Render Professional**: $7/月（常時起動）
- **Render PostgreSQL**: $7/月（1GB以上、常時起動）

---

## セキュリティ注意事項

1. **SECRET_KEYは必ず変更**
   - ランダムな長い文字列を使用
   - 公開しない

2. **HTTPSを使用**
   - VercelとRenderは自動的にHTTPSを提供

3. **環境変数の管理**
   - `.env`ファイルはGitにコミットしない
   - 環境変数は各サービスのダッシュボードで設定

4. **データベース**
   - データベースURLを公開しない
   - 定期的にバックアップを取る

---

## 今後の改善案

1. **独自ドメインの設定**
   - Vercel/Renderで独自ドメインを設定可能

2. **PWA対応**
   - Service Workerを追加してオフライン対応

3. **通知機能**
   - プッシュ通知の実装

4. **監視とアラート**
   - UptimeRobotなどでサービス監視

---

## サポート

問題が発生した場合：

1. Renderのログを確認
2. Vercelのデプロイログを確認
3. ブラウザの開発者ツールでコンソールエラーを確認

デプロイ完了おめでとうございます！
