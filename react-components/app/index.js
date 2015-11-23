import React, {createElement} from 'react'
import {render} from 'react-dom'
import store from './store'
import subscribeActions from '../actions/subscribe'
import client from '../backend/client'
import channelSearch from '../channel-search'
import subscriptionWarning from '../subscription-warning'
import typingNotification from '../typing-notification'

render(
  createElement(channelSearch(store)),
  document.body.appendChild(document.createElement('grape-channel-search'))
)

render(
  createElement(subscriptionWarning(store)),
  document.body.appendChild(document.createElement('grape-subscription-warning'))
)

document.registerReact('grape-typing-notification', typingNotification(store))

subscribeActions(client.connect())
