import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {unreadChannelsSelector} from '../selectors'
import UnreadChannels from './UnreadChannels'

const ConnectedUnreadChannels = connect(
  unreadChannelsSelector
)(UnreadChannels)

export default function init(store) {
  return class UnreadChannelsProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedUnreadChannels />
        </Provider>
      )
    }
  }
}
