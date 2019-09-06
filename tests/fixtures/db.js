const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')

const user1Id = new mongoose.Types.ObjectId()
const user1 = {
  _id: user1Id,
  name: 'Mr RoBot',
  email: 'domoarig@omrrobo.to',
  password: '01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100',
  tokens: [{
    token: jwt.sign({_id: user1Id}, process.env.JWT_SECRET)
  }]
}

const setupDb = async () => {
  await User.deleteMany()
  await new User(user1).save()
}

module.exports = {
  user1Id,
  user1,
  setupDb
}
