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

render(
  createElement(channelSearch(store)),
  document.body.appendChild(document.createElement('grape-channel-search'))
)
render(
  createElement(billingWarning(store)),
  document.body.appendChild(document.createElement('grape-billing-warning'))
)

document.registerReact('grape-typing-notification', typingNotification(store))
document.registerReact('grape-user-profile', userProfile(store))
document.registerReact('grape-channel-info', channelInfo(store))
document.registerReact('grape-shared-files', sharedFiles(store))
document.registerReact('grape-mentions', mentions(store))
document.registerReact('grape-message-search', messageSearch(store))
document.registerReact('grape-alerts', alerts(store))

subscribeActions(client.connect())
