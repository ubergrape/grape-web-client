import './src/setup'
import Browser from './src/core/Browser'

import EmojiBrowser from './src/emoji/Browser'
export {EmojiBrowser as EmojiBrowser}

// Register reactive element.
if (document.registerReact) {
<<<<<<< Updated upstream
    document.registerReact('grape-browser', Browser)
=======
  document.registerReact('grape-search-browser', SearchBrowser)
  document.registerReact('grape-emoji-browser', EmojiBrowser)
>>>>>>> Stashed changes
}
