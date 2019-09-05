const express = require('express')
require('./db/mongoose')

const Task = require('./models/Task')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express ()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log('Server up on port ' + port)
})

const jwt = require('jsonwebtoken')

const func = async () => {
  const token = jwt.sign({_id: '1'}, 'secret', {expiresIn: '1 seconds'})
  console.log(token);
  const data = jwt.verify(token, 'secret')
  console.log(data);
}

func()
