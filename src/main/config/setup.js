const contentType = require('../middleware/content-type')
const cors = require('../middleware/cors')
const jsonParser = require('../middleware/json-parser')

module.exports = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
  app.use(contentType)
}
