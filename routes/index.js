var shortener = require('../lib/shortener');

/**
 * Creates the routes for the given express application.
 *
 * @param app - the express application
 */
module.exports = function(app) {
  app.get('/', function(request, response) {
    response.render('index.html'); 
  });

  // TODO
};
