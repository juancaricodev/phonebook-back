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

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1,
//     deleted: false
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: 2,
//     deleted: false
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3,
//     deleted: false
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4,
//     deleted: false
//   },
//   {
//     id: 5,
//     name: 'Camilo',
//     number: '12345',
//     deleted: false
//   },
//   {
//     id: 6,
//     name: 'Carlos',
//     number: '2345423',
//     deleted: true
//   }
// ]

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

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id

  Person
    .findById(id)
    .then(p => res.json(p))
})

app.post('/api/persons', (req, res) => {
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
})

app.put('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const newPerson = req.body

  if (!persons.find(p => p.id === id)) {
    res.status(404).json({
      error: 'id not found'
    })
  }

  persons = persons.filter(p => p.id !== id)
  persons = [...persons, newPerson]

  res.status(200).json(newPerson)
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person
    .findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.listen(config.port, () => {
  console.log(`Server listening on port: ${config.port}`)
})
