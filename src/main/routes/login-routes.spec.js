const request = require('supertest')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const app = require('../config/app')

let userModel

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  test('should return 200 when valid credentials are provided', async () => {
    const user = {
      _id: 'any_id',
      email: 'valid@test.com',
      name: 'test',
      password: bcrypt.hashSync('hashed_pass', 10)
    }
    await userModel.insertOne(user)

    await request(app)
      .post('/api/login')
      .send({
        email: user.email,
        password: 'hashed_pass'
      })
      .expect(200)
  })

  test('should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'test@test.com',
        password: 'hashed_pass'
      })
      .expect(401)
  })
})
