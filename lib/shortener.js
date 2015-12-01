var crypto = require('crypto');

// set up database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/url-shortener');

// short code model to interact with mongodb
// TODO

// number of random bytes to generate for a code
var NUM_RANDOM_BYTES_IN_CODE = 3;

/**
 * Shortens the given URL.
 * @param url -- the URL to shorten
 *
 * Calls callback(error, code):
 * @param error -- an error if one occurred, or null otherwise
 * @param code -- if error is null, the code that maps to the given URL
 */
exports.shortenURL = function(url, callback) {
  // TODO
};

/**
 * Expands the given random code.
 * @param code -- the code to expand
 *
 * Calls callback(error, url):
 * @param error -- an error if one occurred, or null otherwise
 * @param url -- if error is null, the URL that maps to the code
 */
exports.expandCode = function(code, callback) {
  // TODO
};

/**
 * Returns a list of short code models.
 *
 * Calls callback(error, shortCodes):
 * @param error -- an error if one occurred, or null otherwise
 * @param shortCodes -- if error is null, an array of short code models
 */
exports.getShortCodes = function(callback) {
  // TODO
};
