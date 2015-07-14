require('reactive-elements')
var browsers = module.exports = require('./lib/grape-browser')

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', browsers.SearchBrowser)
  document.registerReact('grape-emoji-browser', browsers.EmojiBrowser)
}
