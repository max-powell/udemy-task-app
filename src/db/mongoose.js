const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})

const User = mongoose.model('User', {
  name: {
    type: String
  },
  age: {
    type: Number
  }
})

// const me = new User({name: 'Max', age: 'a'})
//
// me.save()
//   .then(console.log)
//   .catch(console.log)

const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
})

const firstTask = new Task({description: 'First task', completed: true})

firstTask.save()
  .then(console.log)
  .catch(console.log)
