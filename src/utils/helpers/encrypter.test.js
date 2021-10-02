const bcrypt = require('bcrypt')

class Encrypter {
  async compare (value, hash) {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}

describe('Encrypter', () => {
  test('should return true in bcrypt returns true', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('should return false in bcrypt returns false', async () => {
    const sut = new Encrypter()
    bcrypt.isValid = false
    const isValid = await sut.compare('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('should call bcrypt with correct values', async () => {
    const sut = new Encrypter()
    const value = 'any_value'
    const hash = 'any_hash'
    await sut.compare(value, hash)
    expect(bcrypt.value).toBe(value)
    expect(bcrypt.hash).toBe(hash)
  })
})
