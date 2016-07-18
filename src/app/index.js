import {createElement} from 'react'
import {render} from 'react-dom'
import Raven from 'raven-js'
import {organization, user, server} from 'conf'
import {addLocaleData} from 'react-intl'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'

import wrapWithIntlProvider from './wrapWithIntlProvider'
import * as translations from '../i18n'
import subscribeActions from './subscribe'
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
import SidebarProvider from '../components/sidebar/SidebarProvider'
import HistoryProvider from '../components/history/HistoryProvider'

addLocaleData([...en, ...de])

const {languageCode, email, username, id: userId} = user
const messages = translations[languageCode]

Raven.config(server.sentryJsDsn).install()
Raven.setUser({
  email: email,
  id: userId,
  username: username,
  organization: organization.subdomain,
  organizationID: organization.id
})

render(
  createElement(BillingWarningProvider),
  document.body.appendChild(document.createElement('grape-billing-warning'))
)
render(
  createElement(ChannelMembersInviteProvider),
  document.body.appendChild(document.createElement('grape-channel-members-invite'))
)
render(
  createElement(NewConversationProvider),
  document.body.appendChild(document.createElement('grape-new-conversation'))
)
render(
  createElement(UnreadChannelsProvider),
  document.createElement('grape-unread-channels')
)

document.registerReact(
  'grape-header',
  wrapWithIntlProvider(HeaderProvider, languageCode, messages)
)
document.registerReact('grape-sidebar', SidebarProvider)
document.registerReact('grape-typing-notification', TypingNotificationProvider)
document.registerReact('grape-alerts', AlertsProvider)
document.registerReact('grape-orginfo', OrgInfoProvider)
document.registerReact('grape-navigation', NavigationProvider)
document.registerReact('grape-history', HistoryProvider)

export default function init() {
  subscribeActions(createClient().connect())
}
