const personRouter = require('express').Router()
const Person = require('../models/person')

//get all people
personRouter.get('/', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

personRouter.get('/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

personRouter.get('/info', (request, response) => {
  Person.countDocuments({}).then((result) => {
    const time = Date(Date.now())
    console.log(result)

    const responseData = `Phonebook has info for ${result} people <br/> ${time}`

    response.status(200).send(responseData)
  })
})

personRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

personRouter.post('/', async (request, response) => {
  const person = request.body

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  })

  const savedNote = await newPerson.save()
  response.status(201).json(savedNote)
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
