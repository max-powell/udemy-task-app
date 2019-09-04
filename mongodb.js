const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1/27017'
const dbName = 'task-manager'

MongoClient.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to database')
  }

  const db = client.db(dbName)

  // const updatePromise = db.collection('users').updateOne({
  //   _id: new ObjectID('5d66b67ef99ea8600bb87569')
  // }, {
  //   $inc: {
  //     age: 1
  //   }
  // }).then(console.log).catch(console.log)

  // db.collection('tasks')
  //   .updateMany({
  //     completed: false
  //   }, {
  //     $set: {
  //       completed: true
  //     }
  //   })
  //   .then(console.log)
  //   .catch(console.log)

  // db.collection('users')
  //   .deleteMany({
  //     age: 28
  //   })
  //   .then(console.log)
  //   .catch(console.log)

  // db.collection('tasks')
  //   .deleteOne({
  //     completed: true
  //   })
  //   .then(console.log)
  //   .catch(console.log)
})
