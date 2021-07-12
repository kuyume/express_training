import Joi from '@hapi/joi'

// ユーザー登録バリデーションを行う関数
const registerValidaiton = ( data ) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  })
  return schema.validate( data ).error
}

// ログインバリデーションを行う関数
const loginValidaiton = ( data ) => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  })
  return schema.validate( data ).error
}

export { registerValidaiton, loginValidaiton }
