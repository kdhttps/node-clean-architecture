const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

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
})
