const { MissingParamError } = require('../../utils/errors')
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
    await this.loadUserByEmailResository.load(email, password)
  }
}

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('should throw if no password is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('captain@gmail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('should call LoadUserByEmailResository with correct email', async () => {
    class LoadUserByEmailResositorySpy {
      async load (email) {
        this.email = email
      }
    }

    const loadUserByEmailResository = new LoadUserByEmailResositorySpy()
    const sut = new AuthUseCase(loadUserByEmailResository)
    const email = 'captain@gmail.com'
    await sut.auth(email, 'abc123')
    expect(loadUserByEmailResository.email).toBe(email)
  })
})
