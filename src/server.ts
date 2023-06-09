import cors from '@fastify/cors'
import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories.js'
import { authRoutes } from './routes/auth.js'
import jwt from '@fastify/jwt'
import { uploadRoutes } from './routes/upload.js'
import { resolve } from 'path'

const app = fastify()

app.register(require('@fastify/multipart'))
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(cors, {
  origin: true,
})
app.register(jwt, {
  secret: 'spacetime',
})

app.register(memoriesRoutes)
app.register(uploadRoutes)
app.register(authRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP server running on https://localhost:3333')
  })
