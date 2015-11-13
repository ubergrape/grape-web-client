import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import Emitter from 'emitter'

import ChannelSearch from './ChannelSearch'
import reducers from './reducers'

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

export function channelSearchInit(emitter) {
  let store = createStore(reducers)
  let searchElement = document.querySelector(el)

  render(
    <Provider store={store}>
      <ChannelSearch
        emitter={emitter} />
    </Provider>,
    searchElement
  )
}
