#!/bin/bash

# データベースマイグレーション（必要に応じて）
# alembic upgrade head

# Uvicornサーバーを起動
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
