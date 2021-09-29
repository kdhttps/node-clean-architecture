const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailResositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailResository = new LoadUserByEmailResositorySpy()
  loadUserByEmailResository.user = {}
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
    expect(promise).rejects.toThrow()
  })

  test('should throw error when no LoadUserByEmailResository has no load method', async () => {
    const sut = new AuthUseCase({})
    const email = 'captain@gmail.com'
    const promise = sut.auth(email, 'abc123')
    expect(promise).rejects.toThrow()
  })

  test('should returns null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailResository } = makeSut()
    loadUserByEmailResository.user = null
    const accessToken = await sut.auth('loki@gmail.com', 'abc123')
    expect(accessToken).toBeNull()
  })

  test('should returns null if an invalid password is provided', async () => {
    const { sut, loadUserByEmailResository } = makeSut()
    loadUserByEmailResository.user = null
    const accessToken = await sut.auth('captain@gmail.com', 'xyz321')
    expect(accessToken).toBeNull()
  })
})
