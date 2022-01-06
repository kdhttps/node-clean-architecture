const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param.error')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('LoadUserByEmail repository', () => {
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

  test('should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid@gmail.com')
    expect(user).toBeNull()
  })

  test('should return an user if user is found', async () => {
    const validUserEmail = 'valid@gmail.com'
    const { sut, userModel } = makeSut()
    const mockUser = { _id: 'some-user-id', email: validUserEmail }
    await userModel.insertOne(mockUser)

    const user = await sut.load(validUserEmail)
    expect(user.email).toBe(validUserEmail)
  })

  test('should throw error if no userModel is provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('test@test.com')
    expect(promise).rejects.toThrow()
  })

  test('should throw error if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
