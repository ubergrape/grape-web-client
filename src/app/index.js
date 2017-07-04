import React from 'react'
import ReactDom from 'react-dom'
import Raven from 'raven-js'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import moment from 'moment'

import conf from '../conf'
import {create as createClient} from '../utils/backend/client'
import subscribe from './subscribe'
import App from './App'
import EmbeddedApp from './EmbeddedApp'

const {organization, user, server, embed} = conf
const {languageCode: locale, email, username, id: userId} = user

export function init() {
  addLocaleData([...en, ...de])
  moment.locale(locale)

  Raven.config(server.sentryJsDsn).install()
  Raven.setUser({
    email,
    id: userId,
    username,
    organization: organization.subdomain,
    organizationID: organization.id
  })
  subscribe(createClient().connect())
}

export function renderSheetsInsertionPoints() {
  document.head.appendChild(document.createComment('jss-theme-reactor'))
  document.head.appendChild(document.createComment('grape-jss'))
}

function internalRender() {
  const container = document.querySelector(conf.container)
  const Component = embed ? EmbeddedApp : App

  if (container) {
    ReactDom.render(React.createElement(Component), container)
  }
}

export function render() {
  if (__DEV__ && 'performance' in window && 'now' in window.performance) {
    const before = performance.now()
    internalRender()
    const diff = performance.now() - before
    // eslint-disable-next-line no-console
    console.log(`Initial render took ${diff}ms`)
  } else {
    internalRender()
  }
}
