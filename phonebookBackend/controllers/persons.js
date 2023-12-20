const personRouter = require('express').Router()
const Person = require('../models/person')

//get all people
personRouter.get('/', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

personRouter.get('/:id', (request, response, next) => {
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

personRouter.get('/info', (request, response) => {
  Person.countDocuments({}).then((result) => {
    const time = Date(Date.now())
    console.log(result)

    const responseData = `Phonebook has info for ${result} people <br/> ${time}`

    response.status(200).send(responseData)
  })
})

personRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
      //mongoose.connection.close();
    })
    .catch((error) => next(error))
})

personRouter.post('/', (request, response, next) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  })

  newPerson
    .save()
    .then((savedperson) => {
      response.status(201).json(savedperson)
    })
    .catch((error) => next(error))
})

personRouter.put('/:id', (request, response, next) => {
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

module.exports = personRouter
