const crypto = require('crypto')

// set up database connection
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/url-shortener')

// short code model to interact with mongodb
const shortCodeSchema = mongoose.Schema({
  url: String,
  code: String
})
const ShortCode = mongoose.model('ShortCode', shortCodeSchema)

// number of random bytes to generate for a code
const NUM_RANDOM_BYTES_IN_CODE = 3

/**
 * Shortens the given URL.
 * @param url -- the URL to shorten
 *
 * Calls callback(error, code):
 * @param error -- an error if one occurred, or null otherwise
 * @param code -- if error is null, the code that maps to the given URL
 */
exports.shortenURL = (url, callback) => {
  // generate short code
  crypto.randomBytes(NUM_RANDOM_BYTES_IN_CODE, (error, bytes) => {
    if (error) {
      callback(error)
      return
    }

    // associate code with URL
    const code = bytes.toString('hex')
    const shortCode = new ShortCode({
      url: url,
      code: code
    })

    shortCode.save(error => {
      if (error) {
        callback(error)
      } else {
        callback(null, code)
      }
    })
  })
}

/**
 * Expands the given random code.
 * @param code -- the code to expand
 *
 * Calls callback(error, url):
 * @param error -- an error if one occurred, or null otherwise
 * @param url -- if error is null, the URL that maps to the code
 */
exports.expandCode = (code, callback) => {
  ShortCode.findOne({ code: code }, (error, code) => {
    if (error) {
      callback(error)
    } else {
      callback(null, code.url)
    }
  })
}

/**
 * Returns a list of short code models.
 *
 * Calls callback(error, shortCodes):
 * @param error -- an error if one occurred, or null otherwise
 * @param shortCodes -- if error is null, an array of short code models
 */
exports.getShortCodes = callback => {
  ShortCode.find((error, codes) => {
    if (error) {
      callback(error)
    } else {
      callback(null, codes)
    }
  })
}
