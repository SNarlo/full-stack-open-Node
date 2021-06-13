require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Entry = require('./models/entry') // connection to MongoDB module

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req) => { //created a token called body
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', request.body))

// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } 

//   next(error)
// }

// // this has to be the last loaded middleware.
// app.use(errorHandler)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
  
})

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
  .then(entry => {
    if (entry) {
      response.json(entry)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.get('/info', (request, response) => {
  response.send(
  `<p>Phone book has info for ${Entry.count()} people
  <br></br>
  ${Date()}
  </p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  Entry.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))

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

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})