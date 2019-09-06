const express = require('express')
const User = require('../models/user')
const router = express.Router()
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

router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id
  const updates = req.body
  const allowedUpdates = Object.keys(User.schema.obj)

  const isValid = Object.keys(updates).every(u => allowedUpdates.includes(u))

  if (!isValid) {
    res.status(400).send({error: 'Invalid fields'})
  }

  try {
    const user = await User.findById(_id)

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

module.exports = router
