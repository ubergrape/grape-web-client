import './src/setup'
import Browser from './src/core/Browser'

// Register reactive element.
if (document.registerReact) {
    document.registerReact('grape-browser', Browser)
}
