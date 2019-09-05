const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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

userSchema.pre('save', async function (next) {
  console.log('just before saving');
  if(this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
