const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailResository, encrypter, tokenGenerator) {
    this.loadUserByEmailResository = loadUserByEmailResository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailResository.load(email)
    if (!user) {
      return null
    }

    const isValid = await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }
    await this.tokenGenerator.generate(user.userId)
  }
}
