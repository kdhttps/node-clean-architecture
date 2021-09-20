const LoginRouter = require('./login-router')
const MissingParamError = require('../helpers/missing-param.error')

const makeSut = () => {
  return new LoginRouter()
}

describe('Login Router', () => {
  test('should return 400 if email is not provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        password: 'aBc123'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if password is not provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'captain@gmail.com'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if httpRequest is not provided', () => {
    const sut = makeSut()
    const httpResponse = sut.route(null)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if httpRequest has no body', () => {
    const sut = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
