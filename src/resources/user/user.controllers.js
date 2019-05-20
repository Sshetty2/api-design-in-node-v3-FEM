import { User } from './user.model'
import bcrypt from 'bcrypt'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  // update hook doesnt work for find and update so the password needs to be hashed if that is being updated
  console.log(req.user._id)
  console.log(req.user)
  if (req.body.password !== undefined) {
    bcrypt.hash(req.body.password, 8, async (err, hash) => {
      if (err) {
        return res.status(400).end()
      }
      req.body.password = hash
      try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, {
          new: true
        })
          .lean()
          .exec()

        res.status(200).json({ data: user })
      } catch (e) {
        console.error(e)
        res.status(400).end()
      }
    })
  } else {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true
      })
        .lean()
        .exec()

      res.status(200).json({ data: user })
    } catch (e) {
      console.error(e)
      res.status(400).end()
    }
  }
}
