import * as http from 'node:http'

const server = http.createServer(async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end(`Hello !`)
})

server.listen(8000, () => {
  console.log(`Server running at port 8000`)
})
