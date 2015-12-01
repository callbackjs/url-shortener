var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// serve all files out of public folder
app.use(express.static('public'));

// parse json bodies in post requests
app.use(bodyParser.json());

// TODO: url shortener code

var port = 3000;
console.log('Listening at 127.0.0.1:' + port);
app.listen(port);
