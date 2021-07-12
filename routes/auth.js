import Express from 'express'
import User from '../model/User.js'
import jwt from 'jsonwebtoken'
import { registerValidaiton, loginValidaiton } from '../validation.js'
import bcrypt from 'bcryptjs'

// Routerのインスタンスを立てる
const router = Express.Router()


// registerのパスにPOSTリクエストが来たとき（ユーザー登録なので同期関数）
router.post('/register', async (req, res) => {
  
  // Userデータの事前バリデーション
  const validation_err = registerValidaiton( req.body )

  // 何らかのバリデーションエラーが有った場合、エラー内容を400として返し、その後の処理を中断
  if ( validation_err ) {
    return res.status(400).send(validation_err.details[0].message)
  }

  // データベース内にメールアドレスの重複データがないか確認する
  const emailExist = await User.findOne({email: req.body.email})

  // メールアドレスがいずれかのアカウントと重複していた場合にエラーを400として返す
  if ( emailExist ) {
    return res.status(400).send('Email already exists.')
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // Userのデータインスタンスを定義（中身はリクエストのvalueを参照）
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })

  // mongoDBにuserを登録し、成功したらそのままレスポンスとして返す
  try {
    const savedUser = await user.save()
    res.send({ user: user._id })
  }

  // 失敗したらエラーメッセージを返す
  catch ( err ) {
    res.status(400).send(err)
  }
})

router.post('/login', async (req, res) => {
  // Userデータの事前バリデーション
  const validation_err = loginValidaiton( req.body )

  // 何らかのバリデーションエラーが有った場合、エラー内容を400として返し、その後の処理を中断
  if ( validation_err ) {
    return res.status(400).send(validation_err.details[0].message)
  }

  // データベース内に対象アカウントがあるか確認する
  const user = await User.findOne({email: req.body.email})

  // データベース内にメールアドレスが存在しない場合、エラー内容を400として返し、その後の処理を中断
  if ( !user ) {
    return res.status(400).send('Email or password is not found.')
  }

  // リクエストされたパスワードとデータベース内のパスワードが同じか確認する
  const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

  // リクエストされたパスワードとデータベース内のパスワードが異なる場合、エラー内容を400として返し、その後の処理を中断
  if( !isPasswordValid ) {
    return res.status(400).send('Invalid password.')
  }

  // すべての認証を通ったあと、トークン（JWT）を作る
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)

  // 作ったトークンをヘッダーに付与する
  res.header('auth-token', token)

  // すべての認証を通ったあと、ログイン成功のレスポンスを返す
  return res.status(200).send({
    message: 'Logged in!',
    token: token
  })
})

export default router
