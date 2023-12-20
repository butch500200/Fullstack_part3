const Person = require('../models/person')

const initialPhonebook = [
  {
    name: 'Joseph Cassidy',
    number: '313-9180169',
  },
  {
    name: 'Emily Kinney',
    number: '313-4160984',
  },
]

const nonExistingId = async () => {
  const person = new Person({
    name: 'John Smaith',
    number: '313-4160984',
  })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const person = await Person.find({})
  return person.map((p) => p.toJSON())
}

module.exports = {
  initialPhonebook,
  nonExistingId,
  personsInDb,
}
