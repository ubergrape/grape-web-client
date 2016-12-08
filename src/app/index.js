import React from 'react'
import ReactDom from 'react-dom'
import Raven from 'raven-js'
import {organization, user, server} from 'conf'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import moment from 'moment'

import * as translations from '../i18n'
import {create as createClient} from '../utils/backend/client'
import subscribe from './subscribe'
import App from './App'

const {languageCode: locale, email, username, id: userId} = user
const messages = translations[locale]

export function init() {
  addLocaleData([...en, ...de])
  moment.locale(locale)

  Raven.config(server.sentryJsDsn).install()
  Raven.setUser({
    email: email,
    id: userId,
    username: username,
    organization: organization.subdomain,
    organizationID: organization.id
  })
  subscribe(createClient().connect())
}

export function render() {
  const container = document.createElement('div')
  container.className = 'grape-web-client'
  document.body.appendChild(container)
  ReactDom.render(<App locale={locale} messages={messages} />, container)
}
