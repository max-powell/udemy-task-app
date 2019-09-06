const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')

const userSchema = mongoose.Schema({
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
    unique: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'user'
})

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({_id: this._id}, 'secret')
  this.tokens = this.tokens.concat({token})
  await this.save()
  return token
}

userSchema.methods.toJSON = function() {
  const userObj = this.toObject()
  delete userObj.password
  delete userObj.tokens
  return userObj
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})


  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
}

userSchema.pre('save', async function (next) {
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

userSchema.pre('remove', async function(next) {
  await Task.deleteMany({user: this._id})
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
