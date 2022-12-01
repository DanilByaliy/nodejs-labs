import * as http from 'node:http'
import router from './api.js'
import { config } from 'dotenv'
config()

const PORT = parseInt(process.env.PORT) || 8000

const server = http.createServer(async (req, res) => {
  await router.handle(req, res)
})

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})

server.on('clientError', (_, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

process.on('SIGINT', () => {
  server.close((error) => {
    if (error) {
      console.error(error)
      process.exit(1)
    }
  })
  process.exit(0)
})
