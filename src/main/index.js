const app = require('./config/app')

app.get('/mango', (req, res) => {
  res.send('manog')
})

app.listen(8585, () => {
  console.log('running...')
})
