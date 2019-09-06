const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
  user2Id,
  user2,
  task1,
  task2,
  task3,
  setupDb
} = require('./fixtures/db')

beforeEach(setupDb)

test('Should create task for user', async () => {
  const res = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send({
      description: 'New task'
    })
    .expect(201)

  const task = await Task.findById(res.body._id)
  expect(task).not.toBeNull()
  expect(task.completed).toBe(false)
})

test('Should get tasks for a user', async () => {
  const res = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200)

  const tasks = res.body
  expect(tasks.length).toBe(2)
})

test('Should fetch only incomplete tasks', async () => {
  const res = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200)

  const tasks = res.body
  expect(tasks.length).toBe(1)
})

test('Should sort by createdAt descending', async () => {
  const res = await request(app)
    .get('/tasks?sortBy=createdAt_desc')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200)

  const tasks = res.body
  expect(tasks[0]._id).toBe(task2._id.toString())
})

test('Should update task', async () => {
  const res = await request(app)
    .patch(`/tasks/${task1._id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send({completed: true})
    .expect(200)

  const task = await Task.findById(task1._id)
  expect(task.completed).toBe(true)
})

test('Should reject invalid fields on update', async () => {
  const res = await request(app)
  .patch(`/tasks/${task1._id}`)
  .set('Authorization', `Bearer ${user2.tokens[0].token}`)
  .send({location: 'London'})
  .expect(400)
})

test("Should not allow user to delete another users' task", async () => {
  await request(app)
    .delete(`/tasks/${task3._id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)

  const task = await Task.findById(task3._id)
  expect(task).not.toBeNull()
})
