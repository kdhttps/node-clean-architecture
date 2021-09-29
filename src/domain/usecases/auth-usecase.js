const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailResository, encrypter) {
    this.loadUserByEmailResository = loadUserByEmailResository
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailResository.load(email, password)
    if (!user) {
      return null
    }
    await this.encrypter.compare(password, user.password)
    return null
  }
}
