const UnauthenticatedError = require('../errors/unauthenticated.error')
const ServerError = require('../errors/server.error')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
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
