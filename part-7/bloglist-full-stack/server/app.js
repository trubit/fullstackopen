const express = require('express')
require('express-async-errors')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./middleware/middleware')

const app = express()

morgan.token('request-body', (request) => JSON.stringify(request.body))

app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'dist')))
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :request-body')
)

if (process.env.NODE_ENV !== 'test') {
  app.use(middleware.requestLogger)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.get('*', (request, response) => {
  if (request.path.startsWith('/api/')) {
    return response.status(404).json({ error: 'unknown endpoint' })
  }

  return response.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
