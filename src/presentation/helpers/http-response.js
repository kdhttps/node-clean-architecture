const MissingParamError = require('./missing-param.error')
const Unauthenticated = require('./unauthenticated.error')
module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static internalServerError () {
    return {
      statusCode: 500
    }
  }

  static unAuthenticatedError () {
    return {
      statusCode: 401,
      body: new Unauthenticated()
    }
  }

  static ok (body) {
    return {
      statusCode: 200,
      body
    }
  }
}
