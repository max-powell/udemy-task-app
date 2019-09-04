const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    validate: {
      validator(v) {
        return !!(v > 0)
      },
      message: 'Age must be a positive number'
    }
  }
})

const me = new User({name: 'Bob', age: -1})

me.save()
  .then(console.log)
  .catch(console.log)

const Task = mongoose.model('Task', {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
})

// const firstTask = new Task({description: 'First task', completed: true})
//
// firstTask.save()
//   .then(console.log)
//   .catch(console.log)
