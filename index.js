import './src/setup'
import SearchBrowser from './src/search/Browser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './src/emoji/Browser'
export {EmojiBrowser as EmojiBrowser}

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', SearchBrowser)
  document.registerReact('grape-emoji-browser', EmojiBrowser)
}
