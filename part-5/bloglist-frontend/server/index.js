const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)

if (!config.MONGODB_URI) {
  logger.error('MONGODB_URI is missing. Add it in server/.env')
  process.exit(1)
}

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((err) => {
    logger.error('error connecting to MongoDB:', err.message)
    process.exit(1)
  })

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
