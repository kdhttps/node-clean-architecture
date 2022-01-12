jest.mock('jsonwebtoken', () => ({
  token: 'any_token',
  sign (id, secret) {
    this.id = id
    this.secret = secret
    return this.token
  }
}))
const jwt = require('jsonwebtoken')
const { MissingParamError } = require('../errors')
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('should return token if JWT returns token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('should call JWT with correct parameters', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toEqual({ _id: 'any_id' })
    expect(jwt.secret).toBe(sut.secret)
  })

  test('should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_id')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  test('should throw if id is provided', async () => {
    const sut = new TokenGenerator('secret')
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
