import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import pkg from 'pg'
const { Pool } = pkg

const fastify = Fastify({
  logger: true
})

const initialize = async () => {
  // Register Swagger
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'API Documentation',
        description: 'API documentation for the Fullstack App',
        version: '1.0.0'
      },
      host: process.env.NODE_ENV === 'production' ? 'localhost' : 'localhost:4000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json']
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  })

  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  })
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
})

fastify.get('/health', {
  schema: {
    description: 'Health check endpoint',
    tags: ['health'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' }
        }
      }
    }
  }
}, async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await initialize()
    await fastify.listen({ port: 4000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()