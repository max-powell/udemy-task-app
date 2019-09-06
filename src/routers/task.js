const express = require('express')
const Task = require('../models/Task')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id
  })

  try {
    task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', auth, async (req, res) => {
  try {
    const user = req.user
    await user.populate('tasks').execPopulate()
    res.send(user.tasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const user = req.user._id

  try {
    const task = await Task.findOne({_id, user})
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const user = req.user._id
  const updates = req.body
  const allowedUpdates = Object.keys(Task.schema.obj)

  const isValid = Object.keys(updates).every(u => allowedUpdates.includes(u))

  if (!isValid) {
    return res.status(400).send({error: 'Invalid fields'})
  }

  try {
    const task = await Task.findOne({_id, user})

    if (!task) {
      return res.status(404).send()
    }

    for (u in updates) {
      task[u] = updates[u]
    }

    await task.save()

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const user = req.user._id

  try {
    const task = await Task.findOneAndDelete({_id, user})

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    console.log(e);
    res.status(500).send()
  }
})

module.exports = router
