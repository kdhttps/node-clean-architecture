const UnauthenticatedError = require('../errors/unauthenticated.error')
const ServerError = require('../errors/server.error')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: {
        error: error.message
      }
    }
  }

  static internalServerError () {
    return {
      statusCode: 500,
      body: {
        error: new ServerError().message
      }
    }
  }

  static unAuthenticatedError () {
    return {
      statusCode: 401,
      body: {
        error: new UnauthenticatedError().message
      }
    }
  }

  static ok (body) {
    return {
      statusCode: 200,
      body
    }
  }
}
