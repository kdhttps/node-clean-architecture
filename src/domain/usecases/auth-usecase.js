const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailResository, encrypter, tokenGenerator }) {
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
    const isUserValid = user && await this.encrypter.compare(password, user.password)

    if (isUserValid) {
      return await this.tokenGenerator.generate(user.userId)
    }
    return null
  }
}
