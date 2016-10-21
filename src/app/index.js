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
import BillingWarningProvider from '../components/billing-warning/BillingWarningProvider'
import TypingNotificationProvider from '../components/typing-notification/TypingNotificationProvider'
import AlertsProvider from '../components/alerts/AlertsProvider'
import ChannelMembersInviteProvider from '../components/channel-members-invite/ChannelMembersInviteProvider'
import NewConversationProvider from '../components/new-conversation/NewConversationProvider'
import UnreadChannelsProvider from '../components/unread-channels/UnreadChannelsProvider'
import OrgInfoProvider from '../components/org-info/OrgInfoProvider'
import NavigationProvider from '../components/navigation/NavigationProvider'
import HeaderProvider from '../components/header/HeaderProvider'
import SidebarProvider from '../components/redux-sidebar/SidebarProvider'
import HistoryProvider from '../components/redux-history/HistoryProvider'
import InviteToOrgProvider from '../components/redux-invite-to-org/InviteToOrgProvider'
import NotificationSettingsProvider from '../components/redux-notification-settings/NotificationSettingsProvider'

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
  document.body.appendChild(document.createElement('div'))
)
render(
  createElement(wrapWithIntlProvider(ChannelMembersInviteProvider, languageCode, messages)),
  document.body.appendChild(document.createElement('div'))
)
render(
  createElement(wrapWithIntlProvider(NewConversationProvider, languageCode, messages)),
  document.body.appendChild(document.createElement('div'))
)
render(
  createElement(wrapWithIntlProvider(InviteToOrgProvider, languageCode, messages)),
  document.body.appendChild(document.createElement('div'))
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
