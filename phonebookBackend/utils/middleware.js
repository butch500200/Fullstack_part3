var morgan = require('morgan')
const logger = require('../utils/logger')

morgan.token('reqBody', (req) => {
  return JSON.stringify(req.body)
})

//error handler middleware example
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :reqBody'
)

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
}
