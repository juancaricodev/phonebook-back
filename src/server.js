const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { config } = require('./config/index')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))

const morganConfig = (tokens, req, res) => {
  const logMessage = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')

  const logMessageBody = logMessage.concat(' ', tokens.body(req, res))

  if (req.method === 'POST') {
    return logMessageBody
  } else {
    return logMessage
  }
}

app.use(morgan(morganConfig))

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`
        <h2>Phonebook has info for ${persons.length} people.</h2>

        <p>${new Date().toString()}</p>
      `)
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person
    .findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }
  // else if (persons.find(p => p.name === body.name)) {
  //   return res.status(409).json({
  //     error: 'name already exists, must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => res.json(savedPerson))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person
    .findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(err)
}

app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server listening on port: ${config.port}`)
})
