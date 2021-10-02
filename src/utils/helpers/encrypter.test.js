const bcrypt = require('bcrypt')
const Encrypter = require('./encrypter')

const makeSut = () => {
  const sut = new Encrypter()
  return sut
}

describe('Encrypter', () => {
  test('should return true in bcrypt returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('should return false in bcrypt returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const value = 'any_value'
    const hash = 'any_hash'
    await sut.compare(value, hash)
    expect(bcrypt.value).toBe(value)
    expect(bcrypt.hash).toBe(hash)
  })
})
