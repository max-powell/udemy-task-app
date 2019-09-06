const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const user2Id = new mongoose.Types.ObjectId()
const user2 = {
  _id: user2Id,
  name: 'Edison Trent',
  email: 'trent@freeport7.com',
  password: 'Sidewinderf4ng',
  tokens: [{
    token: jwt.sign({_id: user2Id}, process.env.JWT_SECRET)
  }]
}

const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Get money from Lonnigan',
  completed: false,
  user: user2Id
}

const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Find Quintane',
  completed: true,
  user: user2Id
}

const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: '01101011 01101001 01101100 01101100 00100000 01100001 01101100 01101100 00100000 01101000 01110101 01101101 01100001 01101110 01110011',
  completed: false,
  user: user1Id
}

const setupDb = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(user1).save()
  await new User(user2).save()
  await new Task(task1).save()
  await new Task(task2).save()
  await new Task(task3).save()
}

module.exports = {
  user1Id,
  user1,
  user2Id,
  user2,
  task1,
  task2,
  task3,
  setupDb
}
