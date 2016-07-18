import {createElement} from 'react'
import {render} from 'react-dom'
import i18next from 'i18next'
import Raven from 'raven-js'
import {organization, user, server} from 'conf'

import subscribeActions from './subscribe'
import * as translations from '../i18n'
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

Raven.config(server.sentryJsDsn).install()
Raven.setUser({
  email: user.email,
  id: user.id,
  username: user.username,
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

document.registerReact('grape-header', HeaderProvider)
document.registerReact('grape-sidebar', SidebarProvider)
document.registerReact('grape-typing-notification', TypingNotificationProvider)
document.registerReact('grape-alerts', AlertsProvider)
document.registerReact('grape-orginfo', OrgInfoProvider)
document.registerReact('grape-navigation', NavigationProvider)
document.registerReact('grape-history', HistoryProvider)

export default function init() {
  const lang = 'en' // this should be in 'conf'
  const i18nSettings = {
    lng: lang,
    resources: {
      [lang]: {
        translation: translations[lang]
      }
    }
  }
  i18next.init(i18nSettings)
  console.log(i18next.t('HELLO')) // usage
  subscribeActions(createClient().connect())
}
