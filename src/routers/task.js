const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user._id
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if(req.query.sortBy) {
    const [field, order] = req.query.sortBy.split('_')
    sort[field] = order === 'desc' ? -1 : 1
  }

  try {
    const user = req.user
    await user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
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
