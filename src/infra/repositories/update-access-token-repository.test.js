const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
const UpdateAccessTokenRepository = require('./update-access-token-repository')
let db
const user = {
  _id: 'any_id',
  email: 'valid@test.com',
  name: 'test',
  password: 'hashed_password'
}

const makeSut = () => {
  return new UpdateAccessTokenRepository()
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
    const sut = makeSut()

    await db.collection('users').insertOne(user)
    await sut.update(user._id, 'valid_token')
    const updateUser = await db.collection('users').findOne({ _id: user._id })
    expect(updateUser.accessToken).toBe('valid_token')
  })

  test('should throw error if no param provided', async () => {
    const sut = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))
    expect(sut.update('valid_id')).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
