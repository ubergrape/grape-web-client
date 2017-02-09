import React from 'react'
import ReactDom from 'react-dom'
import Raven from 'raven-js'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import moment from 'moment'

import {organization, user, server} from '../conf'
import {create as createClient} from '../utils/backend/client'
import subscribe from './subscribe'
import App from './App'

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

export function render() {
  const container = document.createElement('div')
  container.className = 'grape-web-client'
  document.body.appendChild(container)
  ReactDom.render(<App />, container)
}
