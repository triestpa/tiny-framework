const http = require('http')
const Response = require('./response')
// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters

/** HTTP Server Class - Wraps API route and middleware functionality */
class Server {
  constructor () {
    this.server = http.createServer()
    this.handlers = []
    this.routes = { GET: {}, POST: {}, PUT: {}, PATCH: {}, DELETE: {} }
    this.errorListener = (err) => console.error // Log errors to console by default
  }

  /** Start the server on the specified port */
  start (port) {
    // Listen for and handle incoming HTTP requests
    this.server.on('request', (request, response) => {
      const res = new Response(response)
      this.handleRequest(request, res)
    })

    this.server.listen(port)
  }

  /** Assign middleware to be run before every request is processed */
  use (...handlers) { this.handlers = this.handlers.concat(handlers) }

  /* Assign middleware and handlers for HTTP verb requests, on a given path */
  get (path, ...handlers) { this.routes.GET[path] = handlers }
  post (path, ...handlers) { this.routes.POST[path] = handlers }
  put (path, ...handlers) { this.routes.PUT[path] = handlers }
  patch (path, ...handlers) { this.routes.PATCH[path] = handlers }
  delete (path, ...handlers) { this.routes.DELETE[path] = handlers }

  /** Assign an error callback */
  error (listener) { this.errorListener = listener }

  /** Apply the assigned middleware and catch errors for an incoming HTTP request. */
  async handleRequest (req, res) {
    try {
      // First run the handlers assigned with "server.use"
      await this.callHandlers(this.handlers, req, res)

      // Then run process the request for the provied route
      await this.handleRoute(req, res)
    } catch (err) {
      // Call the error listener if an error is thrown
      this.errorListener.call(this, err, req)

      // Return HTTP 500 if error is not caught within handlers
      res.error(err.message)
    }
  }

  /** Apply the assigned middleware for the HTTP request method and path */
  async handleRoute (req, res) {
    // Check for handlers for the matching HTTP method and path
    const handlers = this.routes[req.method][req.url]
    if (handlers) { // If there are assigned handlers, run them
      await this.callHandlers(handlers, req, res)
    } else {
      // Return 404 error if no matching route handlers are found
      res.error(`Route ${req.method} ${req.url} Not Found`, 404)
    }
  }

  /** Sequentially call each handler in the order that they were assigned */
  async callHandlers (handlers, req, res) {
    for (let handler of handlers) {
      // Stop the middleware chain if a response has been sent
      if (!res.response.headersSent) {
        await handler.call(this, req, res)
      }
    }
  }
}

module.exports = Server