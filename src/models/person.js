const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { mongodb } = require('../config/index')

const url = mongodb.url

console.log('connecting to ', url)

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(res => console.log('connected to MongoDB'))
  .catch(err => console.log('error connecting to MongoDB: ', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)
