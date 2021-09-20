const MissingParamError = require('./missing-param.error')
const UnauthenticatedError = require('./unauthenticated.error')
const ServerError = require('./server.error')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static internalServerError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unAuthenticatedError () {
    return {
      statusCode: 401,
      body: new UnauthenticatedError()
    }
  }

  static ok (body) {
    return {
      statusCode: 200,
      body
    }
  }
}
