const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

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

  test('should throw error if no userModel is provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const user = {
      _id: 'any_id',
      email: 'valid@test.com',
      name: 'test',
      password: 'hashed_password'
    }
    const promise = sut.update(user._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('should throw error if no id is provided', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  test('should throw error if no accessToken is provided', async () => {
    const userModel = db.collection('users')
    const sut = new UpdateAccessTokenRepository(userModel)
    const promise = sut.update('valid_id')
    expect(promise).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
