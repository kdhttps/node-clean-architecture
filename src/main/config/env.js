module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean_code',
  tokenSecret: process.env.TOKEN_SECRET || 'secretabc',
  port: process.env.PORT || 8585
}
