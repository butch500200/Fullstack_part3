const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Person = require('../models/person.js')

beforeEach(async () => {
  await Person.deleteMany({})
  let personObject = new Person(helper.initialPhonebook[0])
  await personObject.save()
  personObject = new Person(helper.initialPhonebook[1])
  await personObject.save()
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

afterAll(async () => {
  await mongoose.connection.close()
})
