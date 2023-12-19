const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.aphbnvr.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const personToString = (person) => {
  return `${person.name} ${person.number}`
}

const addPerson = (person) => {
  person.save().then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

const displayPhonebook = () => {
  Person.find({}).then((result) => {
    // display phone book
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(personToString(person))
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  displayPhonebook()
}

if (process.argv.length > 3) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4] ? process.argv[4] : '',
  })
  addPerson(newPerson)
}

// const person = new Person({
//   name: "Joseph Cassidy",
//   number: "313-918-0169",
// });

// person.save().then((result) => {
//   console.log("person saved");
//   mongoose.connection.close();
// });
