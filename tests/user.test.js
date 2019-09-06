const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { user1Id, user1, setupDb } = require('./fixtures/db')

beforeEach(setupDb)

test('Should sign up a new user', async () => {
  const res = await request(app).post('/users').send({
    name: 'Max',
    email: 'max@test.com',
    password: '1234567'
  }).expect(201)

  const user = await User.findById(res.body.user._id)
  expect(user).not.toBeNull()

  expect(res.body).toMatchObject({
    user: {
      name: 'Max',
      email: 'max@test.com'
    },
    token: user.tokens[0].token
  })

  expect(user.password).not.toBe('1234567')
})

test('Should login existing user', async () => {
  const res = await request(app).post('/users/login').send({
    email: user1.email,
    password: user1.password
  }).expect(200)

  const user = await User.findById(user1._id)
  expect(res.body.token).toBe(user.tokens[1].token)
})

test('Should not login a nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'bad@request.com',
    password: '1234567'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(user1Id)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(user1Id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
      name: 'Max'
    })
    .expect(200)

  const user = await User.findById(user1Id)
  expect(user.name).toEqual('Max')
})

test('Should not update invalid fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send({
      location: 'London'
    })
    .expect(400)
})
