require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Entry = require('./models/entry') // connection to MongoDB module
const { collection } = require('./models/entry')
const { Mongoose } = require('mongoose')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req) => { //created a token called body
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', request.body))


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
  
})

app.get('/api/persons/:id', (request, response) => {
  Entry.findById(request.params.id).then(entry => {
    response.json(entry)
  })
})

app.get('/info', (request, response) => {
  response.send(
  `<p>Phone book has info for ${Mongoose.Entry.count()} people
  <br></br>
  ${Date()}
  </p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()

  response.json(persons)
})

app.post('/api/persons/', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = new Entry({
    name : body.name,
    number : body.number,
  })

  person.save().then(savedPerson =>{
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})