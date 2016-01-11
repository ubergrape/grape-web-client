import SearchBrowser from './components/search-browser/SearchBrowser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './components/emoji-browser/Browser'
export {EmojiBrowser as EmojiBrowser}

import GrapeInput from './components/grape-input/GrapeInput'
export {GrapeInput as GrapeInput}

// Register reactive elements.
import 'reactive-elements'
document.registerReact('grape-search-browser', SearchBrowser)
document.registerReact('grape-emoji-browser', EmojiBrowser)
document.registerReact('grape-input', GrapeInput)
