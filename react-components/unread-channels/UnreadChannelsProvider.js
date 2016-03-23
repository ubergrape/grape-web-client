import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {unreadChannelsSelector as selector} from '../selectors'
import store from '../app/store'
import UnreadChannels from './UnreadChannels'

const ConnectedUnreadChannels = connect(
  selector
)(UnreadChannels)

export default class UnreadChannelsProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedUnreadChannels />
      </Provider>
    )
  }
}
