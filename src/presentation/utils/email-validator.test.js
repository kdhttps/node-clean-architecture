const EmailValidator = require('./email-validator')
const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email validator', () => {
  test('should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('captain@gmail.com')
    expect(isEmailValid).toBe(true)
  })

  test('should return false if validator returns false', () => {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('loki@gmail.com')
    expect(isEmailValid).toBe(false)
  })

  test('should validator with correct email', () => {
    const sut = makeSut()
    const email = 'captain@gmail.com'
    sut.isValid(email)
    expect(validator.email).toBe(email)
  })
})
