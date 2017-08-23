module.exports = (req, res) => {
  return new Promise((resolve, reject) => {
    let body = []

    // Recieve data
    req.on('data', (chunk) => {
      body.push(chunk)
    })

    // Handle request
    req.on('end', () => {
      body = Buffer.concat(body).toString()
      body = JSON.parse(body)
      req.body = body
      resolve()
    })
  })
}