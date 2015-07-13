import 'reactive-elements'
import * as browsers from './src'
export default browsers

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', browsers.SearchBrowser)
  document.registerReact('grape-emoji-browser', browsers.EmojiBrowser)
}
