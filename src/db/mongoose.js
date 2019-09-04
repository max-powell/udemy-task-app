const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true
})

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    default: 0,
    validate: {
      validator(value) {
        return !(value < 0)
      },
      message: 'Age must be a positive number'
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator(value) {
        return validator.isEmail(value)
      },
      message({value}) {
        return `"${value}" is not a valid email`
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate: {
      validator(value) {
        return !(value.toLowerCase().includes('password'))
      },
      message: 'Password can not contain "password"'
    },
    trim: true
  }
})

const me = new User({name: '    Tom   ', email: '   TOM@test.com    ', password: '1234567'})

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
