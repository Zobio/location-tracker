from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import auth, checkins

# データベーステーブルを作成
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Location Tracker API",
    description="位置情報記録サービス",
    version="1.0.0"
)

# CORS設定
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://location-tracker-two-vert.vercel.app",
    # 本番環境のフロントエンドURLをここに追加
    # 例: "https://location-tracker.vercel.app",
    # "https://*.vercel.app",  # Vercelのプレビューデプロイ用
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターを登録
app.include_router(auth.router)
app.include_router(checkins.router)


@app.get("/")
def read_root():
    return {"message": "Location Tracker API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
