import * as browsers from './src'

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', browsers.SearchBrowser)
  document.registerReact('grape-emoji-browser', browsers.EmojiBrowser)
}
import jss from 'jss'
import debug from 'jss-debug'
jss.use(debug)
