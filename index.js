const Server = require('./server')
const server = new Server()
const bodyParser = require('./bodyParser')

server.use(async (req, res) => {
  console.log(req.url)
  console.log(req.method)
})

server.get('/test', (req, res) => {
  res.send('hello world')
})

server.get('/error', (req, res) => {
  throw new Error('Intentional Error')
})

server.post('/echo', bodyParser, (req, res) => {
  res.send(req.body)
})

server.error((err, req) => {
  console.error('Error Oh No!', err)
})

server.start(3000)