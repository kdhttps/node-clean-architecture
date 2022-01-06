const MongoHelper = require('./mongo-helper')

describe('Mongo Helper', () => {
  test('should set db and connection after connection', async () => {
    const sut = MongoHelper
    await sut.connect(global.__MONGO_URI__)
    expect(MongoHelper.db).toBeTruthy()
    expect(MongoHelper.connection).toBeTruthy()
    sut.close()
  })

  test('should unset db and connection after close', async () => {
    const sut = MongoHelper
    await sut.connect(global.__MONGO_URI__)
    await sut.close()
    expect(MongoHelper.db).toBeFalsy()
    expect(MongoHelper.connection).toBeFalsy()
  })
})
