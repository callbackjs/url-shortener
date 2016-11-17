const express = require('express')
const bodyParser = require('body-parser')
const shortener = require('./lib/shortener')

const STATUS_OK = 200
const STATUS_USER_ERROR = 422

const server = express()
// serve all files out of public folder
server.use(express.static('public'))

// parse json bodies in post requests
server.use(bodyParser.json())

server.get('/expand', (request, response) => {
  if (request.query.code) {
    shortener.expandCode(request.query.code, (error, url) => {
      if (error || !url) {
        // no valid url, go back to home
        response.redirect('/')
      } else {
        response.redirect(url)
      }
    })
  } else {
    // we require a code
    response.set({'Content-type': 'text/plain'})
    response.status(STATUS_USER_ERROR)
    response.render('Must provide a code via query string.')
  }
})

server.get('/short-codes', (request, response) => {
  sendShortCodes(response)
})

server.post('/short-codes', (request, response) => {
  const url = request.body.url
  if (!url) {
    response.send(422, 'Must provide url parameter.')
    return
  }

  shortener.shortenURL(url, (error, code) => {
    if (error) {
      throw error
    }

    sendShortCodes(response)
  })
})

/* Fetches the short codes from MongoDB and sends them to the client. */
function sendShortCodes(response) {
  shortener.getShortCodes((error, shortCodes) => {
    if (error) {
      throw error
    }

    response.status(STATUS_OK)
    response.set({'Content-type': 'application/json'})
    response.send(JSON.stringify(shortCodes))
  })
}

const port = 3000
console.log('Listening at 127.0.0.1:' + port)
server.listen(port)
