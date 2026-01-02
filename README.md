# 位置情報記録サービス

携帯でWebサイトにアクセスして、位置情報を利用して「〇〇は何時何分に〇〇県〇〇市(区)にいました」というのを記録するサービスです。

## 技術スタック

### バックエンド
- **FastAPI**: Pythonの高速Webフレームワーク
- **SQLAlchemy**: ORMライブラリ
- **SQLite**: データベース
- **JWT**: 認証システム
- **OpenStreetMap Nominatim**: 逆ジオコーディング（無料）

### フロントエンド
- **React 18**: UIフレームワーク
- **TypeScript**: 型安全な開発
- **Vite**: 高速ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS
- **React Router**: ルーティング
- **Axios**: HTTP通信

## 機能

- ユーザー登録・ログイン（JWT認証）
- 位置情報取得（Geolocation API）
- チェックイン機能（現在地を記録）
- 逆ジオコーディング（緯度経度→住所変換）
- チェックイン履歴表示
- チェックイン削除

## セットアップ

### 前提条件
- Python 3.11以上
- Node.js 20以上
- npm または yarn

### バックエンドのセットアップ

```bash
cd backend

# 仮想環境を作成
python -m venv venv

# 仮想環境を有効化
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 依存関係をインストール
pip install -r requirements.txt

# .envファイルを作成
cp .env.example .env

# サーバーを起動
uvicorn app.main:app --reload
```

バックエンドは http://localhost:8000 で起動します。

### フロントエンドのセットアップ

```bash
cd frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

フロントエンドは http://localhost:5173 で起動します。

### Dockerでの起動（推奨）

```bash
# プロジェクトルートで実行
docker-compose up -d

# ログを確認
docker-compose logs -f
```

- フロントエンド: http://localhost:5173
- バックエンド: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs

## 使い方

1. ブラウザで http://localhost:5173 にアクセス
2. 新規登録でアカウントを作成
3. ログイン
4. 「チェックイン」ボタンを押す
5. ブラウザの位置情報許可を求められたら「許可」を選択
6. 自動的に現在地が記録される
7. 「履歴」から過去のチェックインを確認

## API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン

### チェックイン
- `POST /api/checkins` - チェックイン作成
- `GET /api/checkins` - チェックイン一覧取得
- `GET /api/checkins/{id}` - 特定チェックイン取得
- `DELETE /api/checkins/{id}` - チェックイン削除

詳細なAPIドキュメントは http://localhost:8000/docs で確認できます。

## プロジェクト構造

```
location-tracker/
├── backend/                 # FastAPI バックエンド
│   ├── app/
│   │   ├── api/            # APIエンドポイント
│   │   ├── core/           # 設定・セキュリティ
│   │   ├── models/         # データベースモデル
│   │   ├── schemas/        # Pydanticスキーマ
│   │   ├── services/       # ビジネスロジック
│   │   ├── database.py     # DB接続
│   │   └── main.py         # アプリケーション
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/               # React フロントエンド
│   ├── src/
│   │   ├── components/    # Reactコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── services/      # API通信
│   │   ├── types/         # TypeScript型定義
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

## セキュリティについて

- パスワードはbcryptでハッシュ化して保存
- JWT認証を使用
- HTTPS必須（位置情報はHTTPSでのみ取得可能）
- CORS設定済み

## 今後の拡張案

- 地図上にチェックイン位置を表示
- チェックインの統計情報表示
- データエクスポート機能
- PWA対応（オフライン動作、ホーム画面追加）
- プッシュ通知
- 位置情報の定期自動記録

## ライセンス

MIT

## 作成者

Claude Code
