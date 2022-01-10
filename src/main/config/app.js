const express = require('express')
const setupApp = require('./setup')
const app = express()
const setupRoutes = require('./routes')

setupApp(app)
setupRoutes(app)

module.exports = app
