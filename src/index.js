import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {IntlProvider, addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

import * as translations from './i18n'
import SearchBrowser from './components/search-browser/SearchBrowser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './components/emoji-browser/Browser'
export {EmojiBrowser as EmojiBrowser}

import {GrapeBrowserReactive} from './components/grape-browser'
export {GrapeBrowserReactive as GrapeBrowser} from './components/grape-browser'

// Register reactive elements.
import 'reactive-elements'

addLocaleData([...en, ...de])

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
        <GrapeBrowserReactive {...this.props} />
      </IntlProvider>
    )
  }
}

document.registerReact('grape-input', App)
