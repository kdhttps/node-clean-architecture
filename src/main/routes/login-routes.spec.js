const jwt = require('jsonwebtoken')
const request = require('supertest')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const app = require('../config/app')

let userModel

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    userModel = await MongoHelper.getCollection('users')
    jwt.token = 'abc123'
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
      password: 'hashed_password'
    }

    await userModel.insertOne(user)

    await request(app)
      .post('/api/login')
      .send({
        email: user.email,
        password: user.password
      })
      .expect(200)
  })
})
