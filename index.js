const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

// custom morgan token to log request body
morgan.token('body', (req) => {
  if (req.body && Object.keys(req.body).length > 0) {
    return JSON.stringify(req.body)
  }
  return 'empty body'
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.use(express.static('dist'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello from the phonebook app!</h1>')
})

app.get('/info', (req, res) => {
  const date = new Date()

  res.send(`
    Phonebook has info for ${persons.length} people
    <br>${date}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000)
  return String(id)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing'
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name exists in the phonebook'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})