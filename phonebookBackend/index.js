const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

app.listen(config.PORT, () => {
  logger.info(`listenting on port ${config.PORT}`)
})
