import React, {Component} from 'react'
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

function wrapWithIntlProvider(WrappedComponent, locale, messages) {
  return class extends Component {
    render() {
      return (
        <IntlProvider locale={locale} messages={messages}>
          <WrappedComponent {...this.props} />
        </IntlProvider>
      )
    }
  }
}

export default function init(lang) {
  const messages = translations[lang]

  document.registerReact(
    'grape-search-browser',
    wrapWithIntlProvider(SearchBrowser, lang, messages)
  )
  document.registerReact(
    'grape-emoji-browser',
    wrapWithIntlProvider(EmojiBrowser, lang, messages)
  )
  document.registerReact(
    'grape-input',
    wrapWithIntlProvider(GrapeBrowser, lang, messages)
  )
}

if (__DEV__) init('en')
