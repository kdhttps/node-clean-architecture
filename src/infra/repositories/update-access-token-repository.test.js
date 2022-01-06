const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

describe('UpdateAccessTokenRepository Test', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    db = await MongoHelper.getDB()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  test('should update the user with the given accessToken', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)
    const user = {
      _id: 'any_id',
      email: 'valid@test.com',
      name: 'test',
      password: 'hashed_password'
    }
    await userModel.insertOne(user)
    await sut.update(user._id, 'valid_token')
    const updateUser = await userModel.findOne({ _id: user._id })
    expect(updateUser.accessToken).toBe('valid_token')
  })
})
