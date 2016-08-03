import React, {Component, PropTypes} from 'react'
import {IntlProvider} from 'react-intl'

import * as translations from './i18n'
import SearchBrowser from './components/search-browser/SearchBrowser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './components/emoji-browser/Browser'
export {EmojiBrowser as EmojiBrowser}

import GrapeBrowser from './components/app/GrapeBrowser'
export {GrapeBrowser as GrapeBrowser}

// Register reactive elements.
import 'reactive-elements'

class App extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired
  }

  static defaultProps = {
    locale: 'en'
  }

  render() {
    const {locale} = this.props
    return (
      <IntlProvider locale={locale} messages={translations[locale]}>
        <GrapeBrowser {...this.props} />
      </IntlProvider>
    )
  }
}

document.registerReact('grape-input', App)
