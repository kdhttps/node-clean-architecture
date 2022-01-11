const MongoHelper = require('./mongo-helper')

const makeSut = async () => {
  const sut = MongoHelper
  await sut.connect(global.__MONGO_URI__)
  return sut
}

describe('Mongo Helper', () => {
  test('should set db and connection after connection', async () => {
    const sut = await makeSut()
    expect(MongoHelper.db).toBeTruthy()
    expect(MongoHelper.connection).toBeTruthy()
    sut.close()
  })

  test('should unset db and connection after close', async () => {
    const sut = await makeSut()
    await sut.close()
    expect(MongoHelper.db).toBeFalsy()
    expect(MongoHelper.connection).toBeFalsy()
  })

  test('should connecte after getCollection call', async () => {
    const sut = await makeSut()
    await sut.close()
    await sut.getCollection('users')
    expect(MongoHelper.db).toBeTruthy()
    expect(MongoHelper.connection).toBeTruthy()
    await sut.close()
  })
})
