const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailResository) {
    this.loadUserByEmailResository = loadUserByEmailResository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailResository) {
      throw new MissingParamError('loadUserByEmailResository')
    }
    if (!this.loadUserByEmailResository.load) {
      throw new InvalidParamError('loadUserByEmailResository')
    }

    const user = await this.loadUserByEmailResository.load(email, password)
    if (!user) {
      return null
    }
  }
}

const makeSut = () => {
  class LoadUserByEmailResositorySpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailResository = new LoadUserByEmailResositorySpy()
  const sut = new AuthUseCase(loadUserByEmailResository)

  return { sut, loadUserByEmailResository }
}

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('captain@gmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailResository with correct email', async () => {
    const { sut, loadUserByEmailResository } = makeSut()
    const email = 'captain@gmail.com'
    await sut.auth(email, 'abc123')
    expect(loadUserByEmailResository.email).toBe(email)
  })

  test('should throw error when no LoadUserByEmailResository is provided', async () => {
    const sut = new AuthUseCase()
    const email = 'captain@gmail.com'
    const promise = sut.auth(email, 'abc123')
    expect(promise).rejects.toThrow(new MissingParamError('loadUserByEmailResository'))
  })

  test('should throw error when no LoadUserByEmailResository has no load method', async () => {
    const sut = new AuthUseCase({})
    const email = 'captain@gmail.com'
    const promise = sut.auth(email, 'abc123')
    expect(promise).rejects.toThrow(new InvalidParamError('loadUserByEmailResository'))
  })

  test('should returns null if LoadUserByEmailResository returns null', async () => {
    const { sut } = makeSut()
    const email = 'loki@gmail.com'
    const accessToken = await sut.auth(email, 'abc123')
    expect(accessToken).toBeNull()
  })
})
