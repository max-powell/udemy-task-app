const mongoose = require('mongoose')
const validator = require('validator')

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
      validator(value) {
        return !!(value > 0)
      },
      message: 'Age must be a positive number'
    },
    email: {
      type: String,
      requires: true,
      validate: {
        validator(value) {
          validator.isEmail(value)
        },
        message({value}) {
          return `${v} is not a valid email`
        }
      }
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
