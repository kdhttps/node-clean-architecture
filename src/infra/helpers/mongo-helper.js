const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri, dbName) {
    this.uri = uri
    this.dbName = dbName
    this.connection = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    this.db = await this.connection.db(dbName)
  },

  async close () {
    await this.connection.close()
    this.connection = null
    this.db = null
  },

  async getCollection (name) {
    if (!this.connection) {
      await this.connect(this.uri, this.dbName)
    }
    return this.db.collection(name)
  }
}
