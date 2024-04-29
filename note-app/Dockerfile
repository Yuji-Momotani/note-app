# Node.jsの公式イメージをベースに使用
FROM node:20.11

# アプリケーションディレクトリを作成
WORKDIR /app

# アプリケーションの依存ファイルをインストール
COPY package*.json ./
RUN npm install

# アプリケーションのソースコードをコンテナ内にコピー
# COPY . .

# アプリがリッスンするポートを指定
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "start"]