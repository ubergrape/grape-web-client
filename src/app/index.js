import {createElement} from 'react'
import {render} from 'react-dom'
import subscribeActions from './subscribe'
import client from '../utils/backend/client'
import ChannelSearchProvider from '../components/channel-search/ChannelSearchProvider'
import BillingWarningProvider from '../components/billing-warning/BillingWarningProvider'
import TypingNotificationProvider from '../components/typing-notification/TypingNotificationProvider'
import UserProfileProvider from '../components/user-profile/UserProfileProvider'
import ChannelInfoProvider from '../components/channel-info/ChannelInfoProvider'
import SharedFilesProvider from '../components/shared-files/SharedFilesProvider'
import MentionsProvider from '../components/mentions/MentionsProvider'
import MessageSearchProvider from '../components/message-search/MessageSearchProvider'
import AlertsProvider from '../components/alerts/AlertsProvider'
import ChannelMembersInviteProvider from '../components/channel-members-invite/ChannelMembersInviteProvider'
import UnreadChannelsProvider from '../components/unread-channels/UnreadChannelsProvider'
import OrgInfoProvider from '../components/org-info/OrgInfoProvider'
import NavigationProvider from '../components/navigation/NavigationProvider'
import HeaderProvider from '../components/header/HeaderProvider'

render(
  createElement(ChannelSearchProvider),
  document.body.appendChild(document.createElement('grape-channel-search'))
)
render(
  createElement(BillingWarningProvider),
  document.body.appendChild(document.createElement('grape-billing-warning'))
)
render(
  createElement(ChannelMembersInviteProvider),
  document.body.appendChild(document.createElement('grape-channel-members-invite'))
)
render(
  createElement(UnreadChannelsProvider),
  document.createElement('grape-unread-channels')
)

document.registerReact('grape-header', HeaderProvider)
document.registerReact('grape-typing-notification', TypingNotificationProvider)
document.registerReact('grape-user-profile', UserProfileProvider)
document.registerReact('grape-channel-info', ChannelInfoProvider)
document.registerReact('grape-shared-files', SharedFilesProvider)
document.registerReact('grape-mentions', MentionsProvider)
document.registerReact('grape-message-search', MessageSearchProvider)
document.registerReact('grape-alerts', AlertsProvider)
document.registerReact('grape-orginfo', OrgInfoProvider)
document.registerReact('grape-navigation', NavigationProvider)

subscribeActions(client.connect())
