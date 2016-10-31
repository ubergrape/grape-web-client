import {createElement} from 'react'
import {render} from 'react-dom'
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

import {BillingWarningProvider} from '../containers/billing-warning'
import {TypingNotificationProvider} from '../containers/typing-notification'
import {AlertsProvider} from '../containers/alerts'
import {ChannelMembersInviteProvider} from '../containers/channel-members-invite'
import {NewConversationProvider} from '../containers/new-conversation'
import {UnreadChannelsProvider} from '../containers/unread-channels'
import {OrgInfoProvider} from '../containers/org-info'
import {NavigationProvider} from '../containers/navigation'
import {HeaderProvider} from '../containers/header'
import {SidebarProvider} from '../containers/sidebar'
import {HistoryProvider} from '../containers/history'
import {InviteToOrgProvider} from '../containers/invite-to-org'
import {NotificationSettingsProvider} from '../containers/notification-settings'

const {languageCode, email, username, id: userId} = user
const messages = translations[languageCode]

addLocaleData([...en, ...de])
moment.locale(languageCode)

Raven.config(server.sentryJsDsn).install()
Raven.setUser({
  email: email,
  id: userId,
  username: username,
  organization: organization.subdomain,
  organizationID: organization.id
})

export default function init() {
  subscribe(createClient().connect())
}

// Separately connected Providers.
render(
  createElement(wrapWithIntlProvider(BillingWarningProvider, languageCode, messages)),
  document.createElement('div')
)
render(
  createElement(wrapWithIntlProvider(ChannelMembersInviteProvider, languageCode, messages)),
  document.createElement('div')
)
render(
  createElement(wrapWithIntlProvider(NewConversationProvider, languageCode, messages)),
  document.createElement('div')
)
render(
  createElement(wrapWithIntlProvider(InviteToOrgProvider, languageCode, messages)),
  document.createElement('div')
)
render(
  createElement(wrapWithIntlProvider(UnreadChannelsProvider, languageCode, messages)),
  document.createElement('div')
)
render(
  createElement(wrapWithIntlProvider(NotificationSettingsProvider, languageCode, messages)),
  document.createElement('div')
)

// Reactive elements (can be removed after legacy is removed).
document.registerReact(
  'grape-header',
  wrapWithIntlProvider(HeaderProvider, languageCode, messages)
)
document.registerReact(
  'grape-sidebar',
  wrapWithIntlProvider(SidebarProvider, languageCode, messages)
)
document.registerReact(
  'grape-typing-notification',
  wrapWithIntlProvider(TypingNotificationProvider, languageCode, messages)
)
document.registerReact(
  'grape-alerts',
  wrapWithIntlProvider(AlertsProvider, languageCode, messages)
)
document.registerReact(
  'grape-orginfo',
  wrapWithIntlProvider(OrgInfoProvider, languageCode, messages)
)
document.registerReact(
  'grape-navigation',
  wrapWithIntlProvider(NavigationProvider, languageCode, messages)
)
document.registerReact(
  'grape-history',
  wrapWithIntlProvider(HistoryProvider, languageCode, messages)
)
