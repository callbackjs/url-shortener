var express = require('express');
var bodyParser = require('body-parser');
var shortener = require('./lib/shortener');

var STATUS_OK = 200;
var STATUS_USER_ERROR = 422;

var app = express();
// serve all files out of public folder
app.use(express.static('public'));

// parse json bodies in post requests
app.use(bodyParser.json());

app.get('/expand', function(request, response) {
  if (request.query.code) {
    shortener.expandCode(request.query.code, function(error, url) {
      if (error || !url) {
        // no valid url, go back to home
        response.redirect('/');
      } else {
        response.redirect(url);
      }
    });
  } else {
    // we require a code
    response.set({'Content-type': 'text/plain'});
    response.status(STATUS_USER_ERROR);
    response.render('Must provide a code via query string.');
  }
});

app.get('/short-codes', function(request, response) {
  sendShortCodes(response);
});

app.post('/short-codes', function(request, response) {
  var url = request.body.url;
  if (!url) {
    response.send(422, 'Must provide url parameter.');
    return;
  }

  shortener.shortenURL(url, function(error, code) {
    if (error) {
      throw error;
    }

    sendShortCodes(response);
  });
});

/* Fetches the short codes from MongoDB and sends them to the client. */
function sendShortCodes(response) {
  shortener.getShortCodes(function(error, shortCodes) {
    if (error) {
      throw error;
    }

    response.status(STATUS_OK);
    response.set({'Content-type': 'application/json'});
    response.send(JSON.stringify(shortCodes));
  });
}

var port = 3000;
console.log('Listening at 127.0.0.1:' + port);
app.listen(port);
