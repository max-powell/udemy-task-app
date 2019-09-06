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

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findById(_id)
    if (!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  const updates = req.body
  const allowedUpdates = Object.keys(Task.schema.obj)

  const isValid = Object.keys(updates).every(u => allowedUpdates.includes(u))

  if (!isValid) {
    return res.status(400).send({error: 'Invalid fields'})
  }

  try {
    const task = await Task.findById(_id)

    for (u in updates) {
      task[u] = updates[u]
    }

    await task.save()

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findByIdAndDelete(_id)

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
