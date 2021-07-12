import Express from 'express'
import verify from './verifyToken.js'
import User from '../model/User.js'

// Routerのインスタンスを立てる
const router = Express.Router()

router.get('/', verify, async (req, res) => {
  let current_user_name = ''
  await User.findById(req.user._id, (err, result) => {
    current_user_name = result.name
  })
  res.json({
    user: current_user_name
  })
  console.log(User.find().toObject)
})



export default router
