### NodeJS Tiny Server Framework

A tiny  NodeJS server framework, with a similar interface to Express and Koa.
This is an experiment (and eventually a tutorial) in using the native NodeJS `http` module.

The entire framework is **under 100 lines total** and **does not rely on any external dependencies**.

The syntax is very similar to Express -
```javascript
const Server = require('./server')
const bodyParser = require('./bodyParser')
const server = new Server()

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
```

> **Please do not use this framework in production**.  This repository is intended as a learning resource! This "framework" is missing a lot of important features and general polish that you can find in established high-quality frameworks such as Koa, Express, Hapi, Sails, and Total.
