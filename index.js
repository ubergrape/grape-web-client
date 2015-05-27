import './src/setup'
import SearchBrowser from './src/search/Browser'
export {SearchBrowser as SearchBrowser}

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', SearchBrowser)
}
