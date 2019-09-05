const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
})

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({_id: this._id}, 'secret')
  this.tokens = this.tokens.concat({token})
  await this.save()
  return token
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

const User = mongoose.model('User', userSchema)

module.exports = User
