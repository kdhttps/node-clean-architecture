const request = require('supertest')
const app = require('../config/app')

describe('App Setup', () => {
  test('should return content-type json as a default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send({})
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
