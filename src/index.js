import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

import * as translations from './i18n'
import SearchBrowser from './components/search-browser/SearchBrowser'
export {SearchBrowser as SearchBrowser}

import EmojiBrowser from './components/emoji-browser/Browser'
export {EmojiBrowser as EmojiBrowser}

import {GrapeBrowserReactive} from './components/grape-browser'
export {GrapeBrowserReactive as GrapeBrowser} from './components/grape-browser'

import AppProvider from './containers/app'

// Register reactive elements.
import 'reactive-elements'

addLocaleData([...en, ...de])

const App = (props) = (
  <AppProvider>
    <GrapeBrowserReactive {...props} />
  </AppProvider>
)

document.registerReact('grape-input', App)
