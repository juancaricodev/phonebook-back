const express = require('express')
const app = express()

const { config } = require('./config/index')

app.get('/', (req, res) => {
  res.send('API working')
})

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.listen(config.port, () => {
  console.log(`Server listening on port: ${config.port}`)
})
