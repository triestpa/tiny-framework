const Server = require('../server')
const bodyParser = require('./bodyParser')
const server = new Server()

server.use((req, res) => {
  console.log(req.url)
  console.log(req.method)
})

// The route declaration syntax follows the same structure as Express
server.get('/hello', (req, res) => {
  res.send('hello world')
})

function fakeAuth (req, res) {
  if (req.headers.authorization === 'secret key') {
    req.id = '12345'
  } else {
    console.log('here')
    return res.error('Unauthorized!', 401)
  }
}

// Middleware functions can applied as extra parameters
server.get('/auth', fakeAuth, (req, res) => {
  res.send(req.id)
})

// The post body is not parsed automatically, but can be done via middleware
server.post('/echo', bodyParser, (req, res) => {
  res.send(req.body)
})


// Middleware can be aysnc functions and promises.
// The route handler will always wait for the promise to resolve before continuing.
server.get('/async', pointlessWaiting, pointlessWaiting, async (req, res) => {
  await waitAsync(500)
  res.send(req.message)
})

async function pointlessWaiting (req, res) {
  await waitAsync(200)
  req.message = 'That was pointless'
}

function waitAsync (timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, timeout)
  })
}

// Thrown errors will result in http 500 responses
server.get('/error', (req, res) => {
  throw new Error('Intentional Error')
})

// The error listener will be called whenever an error occurs in the route handlers
server.error((err, req) => {
  console.error('Error Oh No!', err)
})

server.start(3000)