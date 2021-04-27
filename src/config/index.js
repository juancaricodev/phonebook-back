require('dotenv').config()

const config = {
  port: process.env.PORT || 3000
}

const mongodb = {
  password: process.env.MONGO_PASS,
  url: process.env.MONGO_URI
}

module.exports = { config, mongodb }
