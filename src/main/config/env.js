module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-code',
  tokenSecret: process.env.TOKEN_SECRET || 'secretabc'
}
