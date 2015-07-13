import './setup'
import SearchBrowser from './components/browser-search/Browser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './components/browser-emoji/Browser'
export {EmojiBrowser as EmojiBrowser}

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', SearchBrowser)
  document.registerReact('grape-emoji-browser', EmojiBrowser)
}
