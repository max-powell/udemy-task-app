const express = require('express')
require('./db/mongoose')

const Task = require('./models/Task')

const userRouter = require('./routers/user')

const app = express ()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/tasks/:id', async (req, res) => {
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

app.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  const updates = req.body
  const allowedUpdates = Object.keys(Task.schema.obj)

  const isValid = Object.keys(updates).every(u => allowedUpdates.includes(u))

  if (!isValid) {
    return res.status(400).send({error: 'Invalid fields'})
  }

  try {
    const task = await Task.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true
    })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.delete('/tasks/:id', async (req, res) => {
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

app.listen(port, () => {
  console.log('Server up on port ' + port)
})
