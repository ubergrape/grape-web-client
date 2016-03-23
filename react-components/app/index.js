import {createElement} from 'react'
import {render} from 'react-dom'
import subscribeActions from './subscribe'
import client from '../backend/client'
import ChannelSearchProvider from '../channel-search/ChannelSearchProvider'
import BillingWarningProvider from '../billing-warning/BillingWarningProvider'
import TypingNotificationProvider from '../typing-notification/TypingNotificationProvider'
import UserProfileProvider from '../user-profile/UserProfileProvider'
import ChannelInfoProvider from '../channel-info/ChannelInfoProvider'
import SharedFilesProvider from '../shared-files/SharedFilesProvider'
import MentionsProvider from '../mentions/MentionsProvider'
import MessageSearchProvider from '../message-search/MessageSearchProvider'
import AlertsProvider from '../alerts/AlertsProvider'
import ChannelMembersInviteProvider from '../channel-members-invite/ChannelMembersInviteProvider'
import UnreadChannelsProvider from '../unread-channels/UnreadChannelsProvider'
import OrgInfoProvider from '../org-info/OrgInfoProvider'
import NavigationProvider from '../navigation/NavigationProvider'
import FavoriteProvider from '../favorite/FavoriteProvider'

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

document.registerReact('grape-typing-notification', TypingNotificationProvider)
document.registerReact('grape-user-profile', UserProfileProvider)
document.registerReact('grape-channel-info', ChannelInfoProvider)
document.registerReact('grape-shared-files', SharedFilesProvider)
document.registerReact('grape-mentions', MentionsProvider)
document.registerReact('grape-message-search', MessageSearchProvider)
document.registerReact('grape-alerts', AlertsProvider)
document.registerReact('grape-orginfo', OrgInfoProvider)
document.registerReact('grape-navigation', NavigationProvider)
document.registerReact('grape-favorite', FavoriteProvider)

subscribeActions(client.connect())
