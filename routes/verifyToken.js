import jwt from 'jsonwebtoken'

// JWTを基に認証する関数
const auth = (req, res, next) => {

  // リクエストヘッダーに付与されたトークンを取得
  const token = req.header('auth-token')

  // トークンが存在しない場合、エラー内容を401として返し、その後の処理を中断
  if ( !token ) {
    return res.status(401).send('Token doesn\'t exist or expired.')
  }

  try {
    // トークンを検証する
    const current_user_obj = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = current_user_obj
    next()
  }

  catch {
    // トークンが不正の場合、エラー内容を400として返し、その後の処理を中断
    res.status(400).send('Invalid token.')
  }
}

export default auth