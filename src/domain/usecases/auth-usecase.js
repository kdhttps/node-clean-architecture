const { MissingParamError, InvalidParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
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
    if (!this.loadUserByEmailResository) {
      throw new MissingParamError('loadUserByEmailResository')
    }
    if (!this.loadUserByEmailResository.load) {
      throw new InvalidParamError('loadUserByEmailResository')
    }

    const user = await this.loadUserByEmailResository.load(email, password)
    if (!user) {
      return null
    }
  }
}
