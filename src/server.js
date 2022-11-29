import * as http from 'node:http'
import router from './api.js'

const server = http.createServer(async (req, res) => {
  await router.handle(req, res)
})

server.listen(8000, () => {
  console.log(`Server running at port 8000`)
})
