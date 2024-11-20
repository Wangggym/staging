import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import pkg from 'pg'
const { Pool } = pkg

const fastify = Fastify({
  logger: true
})

// 先定义路由
const healthRoute = {
  schema: {
    description: 'Health check endpoint',
    tags: ['health'],
    operationId: 'getHealth',
    response: { 
      200: {
        description: 'Successful response - Health check passed',
        type: 'object',
        properties: {
          status: { 
            type: 'string',
            enum: ['ok', 'error'],
            description: 'The status of the health check'
          },
          database: { 
            type: 'string',
            description: 'Database connection status'
          }
        },
        example: {
          status: 'ok',
          database: 'connected'
        }
      },
      500: {
        description: 'Error response - Health check failed',
        type: 'object',
        properties: {
          status: { 
            type: 'string',
            enum: ['error'],
            description: 'Error status'
          },
          error: { 
            type: 'string',
            description: 'Error message'
          }
        },
        example: {
          status: 'error',
          error: 'Database connection failed'
        }
      }
    }
  }
}

// 初始化函数移到路由定义后面
const initialize = async () => {
  // 先注册 swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'API Documentation',
        description: 'API documentation for the Fullstack App',
        version: '1.0.0'
      },
      servers: [
        {
          url: '/api',  // 修改这里，因为我们通过 nginx 代理到 /api
          description: 'Development server'
        }
      ],
      tags: [
        { 
          name: 'health', 
          description: 'Health check endpoints' 
        }
      ]
    }
  })

  // 然后注册 swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true
    },
    staticCSP: true
  })

  // 注册 CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  })

  // 最后注册路由
  fastify.get('/health', healthRoute, async (request, reply) => {
    try {
      await pool.query('SELECT 1')
      return { 
        status: 'ok',
        database: 'connected'
      }
    } catch (error) {
      reply.status(500)
      return { 
        status: 'error',
        error: 'Database connection failed'
      }
    }
  })
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
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
