const MissingParamError = require('./missing-param.error')
const ServerError = require('./server.error')
const UnauthenticatedError = require('./unauthenticated.error')
const InvalidParamError = require('./invalid-param.error')

module.exports = {
  MissingParamError,
  ServerError,
  UnauthenticatedError,
  InvalidParamError
}
