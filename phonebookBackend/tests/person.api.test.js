const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Person = require('../models/person.js')

beforeEach(async () => {
  await Person.deleteMany({})

  const personObjects = helper.initialPhonebook.map((p) => new Person(p))
  const promiseArry = personObjects.map((p) => p.save())

  await Promise.all(promiseArry)
})

test('all people are returned', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(helper.initialPhonebook.length)
}, 100000)

test('there are two people', async () => {
  const response = await api.get('/api/persons')

  expect(response.body).toHaveLength(helper.initialPhonebook.length)
})

test('the persons is ', async () => {
  const response = await api.get('/api/persons')

  const name = response.body.map((r) => r.name)

  expect(name).toContain('Joseph Cassidy')
})

test('can add one person', async () => {
  const newPerson = { name: 'jhon smith', number: '313-987345' }
  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const personAtEnd = await helper.personsInDb()
  expect(personAtEnd).toHaveLength(helper.initialPhonebook.length + 1)

  const names = personAtEnd.map((n) => n.name)
  expect(names).toContain('jhon smith')
})

test('adding invalid name wont add', async () => {
  const newPerson = { name: 'jh', number: '313-987345' }
  await api.post('/api/persons').send(newPerson).expect(400)

  const phonebook = await helper.personsInDb()

  expect(phonebook).toHaveLength(helper.initialPhonebook.length)
})

test('getting one person', async () => {
  const phonebookAtStart = await helper.personsInDb()
  const firstPerson = await api
    .get(`/api/persons/${phonebookAtStart[0].id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(firstPerson.body).toEqual(phonebookAtStart[0])
})

test('deleting one person', async () => {
  const phonebookAtStart = await helper.personsInDb()
  const personToDelete = phonebookAtStart[0]
  const firstPerson = await api
    .delete(`/api/persons/${personToDelete.id}`)
    .expect(204)

  const phonebookAtEnd = await helper.personsInDb()
  expect(phonebookAtEnd.length).toEqual(phonebookAtStart.length - 1)

  const names = phonebookAtEnd.map((p) => p.name)
  expect(names).not.toContain(firstPerson.name)
})

afterAll(async () => {
  await mongoose.connection.close()
})
