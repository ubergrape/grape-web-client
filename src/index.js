import SearchBrowser from './components/search-browser/SearchBrowser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './components/emoji-browser/Browser'
export {EmojiBrowser as EmojiBrowser}

import App from './components/app/App'
export {App as App}

// Register reactive elements.
import 'reactive-elements'
document.registerReact('grape-search-browser', SearchBrowser)
document.registerReact('grape-emoji-browser', EmojiBrowser)
document.registerReact('grape-input', App)
