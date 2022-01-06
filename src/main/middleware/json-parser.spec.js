const request = require('supertest')
const app = require('../config/app')

describe('App Setup', () => {
  test('should parse body as a json', async () => {
    app.post('/test_json', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test_json')
      .send({ name: 'mango' })
      .expect({ name: 'mango' })
  })
})
