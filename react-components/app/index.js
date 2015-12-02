import React, {createElement} from 'react'
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

subscribeActions(client.connect())
