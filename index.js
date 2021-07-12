import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoute from './routes/auth.js'
import postRoute from './routes/posts.js'

// 環境変数をimport
dotenv.config()

// データベースに接続
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
  console.log('connected to db!')
})

// Expressのインスタンスを立てる
const app = express()

// ExpressでJSON形式を有効化
app.use(express.json())

// ExpressでCORSを許可
app.use(cors())

// ルーターを使用する基準となるパスを指定して初期化（使用を宣言）
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

// 3000番ポートではじめの関数をlisten
app.listen(4000, () => {
  console.log('Server up and running')
})