const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypter = new EncrypterSpy()
  encrypter.isValid = true
  return encrypter
}

const makeUserByEmailRepository = () => {
  class LoadUserByEmailResositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }

  const loadUserByEmailResository = new LoadUserByEmailResositorySpy()
  loadUserByEmailResository.user = {
    password: 'hashedPassword',
    userId: 'avengersCaptain'
  }

  return loadUserByEmailResository
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGenerator = new TokenGeneratorSpy()
  tokenGenerator.accessToken = 'we_dont_do_that_here'
  return tokenGenerator
}

const makeSut = () => {
  const loadUserByEmailResository = makeUserByEmailRepository()
  const encrypter = makeEncrypter()
  const tokenGenerator = makeTokenGenerator()
  const sut = new AuthUseCase({
    loadUserByEmailResository,
    encrypter,
    tokenGenerator
  })
  return {
    sut,
    loadUserByEmailResository,
    encrypter,
    tokenGenerator
  }
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

  test('should throw error when no dependency is provided', async () => {
    const loadUserByEmailResository = makeUserByEmailRepository()
    const encrypter = makeEncrypter()
    const suts = [
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ loadUserByEmailResository: {} }),
      new AuthUseCase({ loadUserByEmailResository: null }),
      new AuthUseCase({
        loadUserByEmailResository: null,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailResository: {},
        encrypter: {},
        tokenGenerator: {}
      }),
      new AuthUseCase({
        loadUserByEmailResository,
        encrypter: {},
        tokenGenerator: {}
      }),
      new AuthUseCase({
        loadUserByEmailResository,
        encrypter: null,
        tokenGenerator: null
      }),
      new AuthUseCase({
        loadUserByEmailResository,
        encrypter,
        tokenGenerator: {}
      }),
      new AuthUseCase({
        loadUserByEmailResository,
        encrypter,
        tokenGenerator: null
      })
    ]
    for (const sut of suts) {
      const email = 'captain@gmail.com'
      const promise = sut.auth(email, 'abc123')
      expect(promise).rejects.toThrow()
    }
  })

  test('should returns null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailResository } = makeSut()
    loadUserByEmailResository.user = null
    const accessToken = await sut.auth('loki@gmail.com', 'abc123')
    expect(accessToken).toBeNull()
  })

  test('should returns null if an invalid password is provided', async () => {
    const { sut, encrypter } = makeSut()
    encrypter.isValid = false
    const accessToken = await sut.auth('captain@gmail.com', 'xyz321')
    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct value', async () => {
    const { sut, loadUserByEmailResository, encrypter } = makeSut()
    const password = 'xyz321'
    await sut.auth('captain@gmail.com', password)
    expect(encrypter.password).toBe(password)
    expect(encrypter.hashedPassword).toBe(loadUserByEmailResository.user.password)
  })

  test('should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailResository, tokenGenerator } = makeSut()
    await sut.auth('captain@gmail.com', 'password')
    expect(tokenGenerator.userId).toBe(loadUserByEmailResository.user.userId)
  })

  test('should return token if correct credentials are provided', async () => {
    const { sut, tokenGenerator } = makeSut()
    const accessToken = await sut.auth('captain@gmail.com', 'password')
    expect(accessToken).toBe(tokenGenerator.accessToken)
    expect(accessToken).toBeTruthy()
  })
})
