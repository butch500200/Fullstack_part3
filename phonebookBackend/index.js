const config = require('./utils/config')
const logger = require('./utils/logger')
const personRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', personRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// morgan.token('reqBody', (req) => {
//   return JSON.stringify(req.body)
// })

app.listen(config.PORT, () => {
  logger.info(`listenting on port ${config.PORT}`)
})
