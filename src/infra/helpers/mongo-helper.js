const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    this.uri = uri
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.connection.db()
  },

  async close () {
    await this.connection.close()
    this.connection = null
    this.db = null
  },

  async getCollection (name) {
    if (!this.connection) {
      await this.connect(this.uri)
    }
    return this.db.collection(name)
  }
}
