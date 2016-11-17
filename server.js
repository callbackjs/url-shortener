const express = require('express')
const bodyParser = require('body-parser')

const server = express()
// serve all files out of public folder
server.use(express.static('public'))

// parse json bodies in post requests
server.use(bodyParser.json())

// TODO: url shortener code

const port = 3000
console.log('Listening at 127.0.0.1:' + port)
server.listen(port)
