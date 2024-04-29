# NoteアプリのAPI
## API概要

### 作成するアプリケーション概要

| HTTPメソッド | パス | 概要 |
| ---- | ---- | ---- |
| POST | /signup | 新しいユーザーを登録する |
| POST | /login | ログイン（JWTトークンの取得） |
| POST | /logout | ログアウト（JWTトークンの失効） |
| GET  | /csrf | CSRFトークンの取得 |
| GET  | /note | ノートの一覧情報を取得 |
| POST  | /note | ノートの情報を登録 |
| PUT  | /note/:id | ノートの情報を更新 |
| DELETE  | /note/:id | ノートの情報を削除 |
