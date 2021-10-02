const bcrypt = require('bcrypt')
const { MissingParamError } = require('../errors')

module.exports = class Encrypter {
  async compare (value, hash) {
    if (!value) {
      throw new MissingParamError('value')
    }
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
