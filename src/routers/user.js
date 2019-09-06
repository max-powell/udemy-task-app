const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({user, token})
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/users/login', async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => {
      return t.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = req.body
  const allowedUpdates = Object.keys(User.schema.obj)

  const isValid = Object.keys(updates).every(u => allowedUpdates.includes(u))

  if (!isValid) {
    res.status(400).send({error: 'Invalid fields'})
  }

  try {
    const user = req.user

    for (u in updates) {
      user[u] = updates[u]
    }

    await user.save()

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/me', auth, async (req, res) => {
  const user = req.user
  try {
    await user.remove()
    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  req.user.avatar = req.file.buffer
  await req.user.save()
  res.send()
}, (e, req, res, next) => {
  res.status(400).send({error: e.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router
