import React, {createElement} from 'react'
import ReactDom from 'react-dom'
import Raven from 'raven-js'
import {organization, user, server} from 'conf'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import moment from 'moment'

import wrapWithIntlProvider from './wrapWithIntlProvider'
import * as translations from '../i18n'
import subscribe from './subscribe'
import {create as createClient} from '../utils/backend/client'

import {App} from '../components/app'

import {BillingWarningProvider} from '../containers/billing-warning'
import {TypingNotificationProvider} from '../containers/typing-notification'
import {AlertsProvider} from '../containers/alerts'
import {ChannelMembersInviteProvider} from '../containers/channel-members-invite'
import {NewConversationProvider} from '../containers/new-conversation'
import {UnreadChannelsProvider} from '../containers/unread-channels'
import {InviteToOrgProvider} from '../containers/invite-to-org'
import {NotificationSettingsProvider} from '../containers/notification-settings'

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

// Separately connected Providers.
ReactDom.render(
  createElement(wrapWithIntlProvider(BillingWarningProvider, locale, messages)),
  document.createElement('div')
)
ReactDom.render(
  createElement(wrapWithIntlProvider(ChannelMembersInviteProvider, locale, messages)),
  document.createElement('div')
)
ReactDom.render(
  createElement(wrapWithIntlProvider(NewConversationProvider, locale, messages)),
  document.createElement('div')
)
ReactDom.render(
  createElement(wrapWithIntlProvider(InviteToOrgProvider, locale, messages)),
  document.createElement('div')
)
ReactDom.render(
  createElement(wrapWithIntlProvider(UnreadChannelsProvider, locale, messages)),
  document.createElement('div')
)
ReactDom.render(
  createElement(wrapWithIntlProvider(NotificationSettingsProvider, locale, messages)),
  document.createElement('div')
)

// Reactive elements (can be removed after legacy is removed).
document.registerReact(
  'grape-typing-notification',
  wrapWithIntlProvider(TypingNotificationProvider, locale, messages)
)
document.registerReact(
  'grape-alerts',
  wrapWithIntlProvider(AlertsProvider, locale, messages)
)
