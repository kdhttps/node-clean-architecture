const LoginRouter = require('./login-router')
const { ServerError, UnauthenticatedError } = require('../errors')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid (email) {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'avengers'
  return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        password: 'aBc123'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toEqual(new MissingParamError('email').message)
  })

  test('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'captain@gmail.com'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
  })

  test('should return 500 if httpRequest is not provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route(null)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'captain@gmail.com',
        password: 'aBc123'
      }
    }

    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.error).toBe(new UnauthenticatedError().message)
  })

  test('should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'captain@gmail.com',
        password: 'abcdefg'
      }
    }

    const { statusCode, body: { accessToken } } = await sut.route(httpRequest)
    expect(statusCode).toBe(200)
    expect(accessToken).toBe(authUseCaseSpy.accessToken)
  })

  test('should return 500 if no auth case provided', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if auth case has no auth method', async () => {
    const sut = new LoginRouter({ authUseCase: null })
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if auth case throws', async () => {
    const authUseCaseSpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('should return 400 if email is is invalid', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'aBc123'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('email').message)
  })

  test('should return 500 if emailValidator is not provided', async () => {
    const sut = new LoginRouter(makeAuthUseCase(), {})
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('should return 500 if emailValidator has not isValid method', async () => {
    const sut = new LoginRouter(makeAuthUseCase(), {})
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('should return 500 if emailValidator throws error', async () => {
    const sut = new LoginRouter(makeAuthUseCase(), makeEmailValidatorWithError())
    const httpRequest = {
      body: {
        email: 'loki@gmail.com',
        password: 'xxx000'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })

  test('should call emailValidator with correct params', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'captain@gmail.com',
        password: 'aBc123'
      }
    }

    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })

  test('should throw error when no dependency is provided', async () => {
    const invalid = {}
    const authUseCase = makeAuthUseCase()
    const suts = [
      new LoginRouter(),
      new LoginRouter({}),
      new LoginRouter({
        authUseCase: invalid
      }),
      new LoginRouter({
        authUseCase
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: invalid
      }),
      new LoginRouter({
        emailValidator: invalid
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'loki@gmail.com',
          password: 'xxx000'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  test('should throw error if any dependency throws error', async () => {
    const authUseCase = makeAuthUseCaseWithError()

    const suts = [
      new LoginRouter({
        authUseCase
      }),
      new LoginRouter({
        authUseCase,
        emailValidator: makeEmailValidatorWithError()
      })
    ]
    for (const sut of suts) {
      const httpRequest = {
        body: {
          email: 'loki@gmail.com',
          password: 'xxx000'
        }
      }

      const httpResponse = await sut.route(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
