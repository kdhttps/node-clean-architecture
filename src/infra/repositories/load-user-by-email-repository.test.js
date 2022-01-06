const { MongoClient } = require('mongodb')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')

let connection
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
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await connection.close()
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
})
