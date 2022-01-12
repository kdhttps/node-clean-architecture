const mongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

mongoHelper.connect(env.mongoUrl)
  .then(() => {
    const app = require('./config/app')
    app.listen(env.port, () => {
      console.log('running...')
    })
  })
  .catch(console.error)
