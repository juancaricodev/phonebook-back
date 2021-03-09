const express = require('express')
const app = express()

const { config } = require('./config/index')

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
    deleted: false
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
    deleted: false
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
    deleted: false
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
    deleted: false
  },
  {
    id: 5,
    name: 'Camilo',
    number: '12345',
    deleted: false
  },
  {
    id: 6,
    name: 'Carlos',
    number: '2345423',
    deleted: true
  }
]

app.get('/info', (req, res) => {
  res.send(`
    <h2>Phonebook has info for ${persons.length} people.</h2>

    <p>${new Date().toString()}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  res.json(person)
})

app.listen(config.port, () => {
  console.log(`Server listening on port: ${config.port}`)
})
