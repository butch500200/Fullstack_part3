require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('reqBody', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :reqBody'
  )
)

//get all people
app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    // display phone book

    response.json(people)
    //mongoose.connection.close();
  })
})

//error handler middleware example
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      //mongoose.connection.close();
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((result) => {
    const time = Date(Date.now())
    console.log(result)

    const responseData = `Phonebook has info for ${result} people <br/> ${time}`

    response.status(200).send(responseData)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
      //mongoose.connection.close();
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body
  // if (!person.name) {
  //   return response.status(400).send("Name missing");
  // }
  // if (phoneBook.find((data) => data.name === person.name)) {
  //   console.log("test");
  //   return response.status(400).send("Name already present");
  // }

  const newPerson = new Person({
    name: person.name,
    number: person.number || '',
  })

  newPerson
    .save()
    .then((savedperson) => {
      response.json(savedperson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then((result) => {
      response.json(result)
    })
    .catch((error) => next(error))
})

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: "unknown endpoint" });
// };

// app.use(unknownEndpoint);
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`listenting on port ${PORT}`)
})
