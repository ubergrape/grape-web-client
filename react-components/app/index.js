import {createElement} from 'react'
import {render} from 'react-dom'
import store from './store'
import subscribeActions from './subscribe'
import client from '../backend/client'
import channelSearch from '../channel-search'
import billingWarning from '../billing-warning'
import typingNotification from '../typing-notification'
import userProfile from '../user-profile'
import channelInfo from '../channel-info'
import sharedFiles from '../shared-files'
import mentions from '../mentions'
import messageSearch from '../message-search'
import alerts from '../alerts'
import inviteChannelMembers from '../channel-members-invite'
import unreadChannels from '../unread-channels'
import NavigationProvider from '../navigation/NavigationProvider'

render(
  createElement(channelSearch(store)),
  document.body.appendChild(document.createElement('grape-channel-search'))
)
render(
  createElement(billingWarning(store)),
  document.body.appendChild(document.createElement('grape-billing-warning'))
)
render(
  createElement(inviteChannelMembers(store)),
  document.body.appendChild(document.createElement('grape-channel-members-invite'))
)
render(
  createElement(unreadChannels(store)),
  document.createElement('grape-unread-channels')
)

document.registerReact('grape-typing-notification', typingNotification(store))
document.registerReact('grape-user-profile', userProfile(store))
document.registerReact('grape-channel-info', channelInfo(store))
document.registerReact('grape-shared-files', sharedFiles(store))
document.registerReact('grape-mentions', mentions(store))
document.registerReact('grape-message-search', messageSearch(store))
document.registerReact('grape-alerts', alerts(store))
document.registerReact('grape-navigation', NavigationProvider)

subscribeActions(client.connect())
