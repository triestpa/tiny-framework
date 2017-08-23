/** Response class to provide helper methods for sending HTTP responses */
class Response {
  /** Contruct with native Node response object */
  constructor (response) {
    this.response = response
  }

  /** Send a formatted JSON response */
  send (content = 'OK', code = 200) {
    this.response.setHeader('Content-Type', 'application/json')
    this.response.status = code
    this.response.write(JSON.stringify(content))
    this.response.end()
  }

  /** Send an error response */
  error (message = 'Server Error', code = 500) {
    this.send(message, code)
  }
}