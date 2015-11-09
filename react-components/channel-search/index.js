import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Emitter from 'emitter'

import ChannelSearch from './ChannelSearch'
import channelSearchReducers from './reducers'

const el = 'grape-channel-search'

export class ChannelSearchEmitter extends Emitter {
  constructor() {
    super()
    this.el = document.createElement(el)
  }

  onOrgReady(org) {
    this.org = org
  }

  onSetUser(user) {
    this.user = user
  }
}

export function channelSearchInit() {

  let store = createStore(channelSearchReducers)
  let searchElement = document.querySelector(el)

  render(
    <Provider store={store}>
      <ChannelSearch emitter={ChannelSearchEmitter} />
    </Provider>,
    searchElement
  )

}


// Register reactive element.
// if (document.registerReact) {
//   document.registerReact('grape-channel-search', ChannelSearch)
// }
