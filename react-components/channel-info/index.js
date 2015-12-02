import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {channelInfoSelector} from '../selectors'
import actions from './actions'
import ChannelInfo from './ChannelInfo'

const ConnectedChannelInfo = connect(
  channelInfoSelector,
  mapActionsToProps(actions)
)(ChannelInfo)

export default function init(store) {
  return class ChannelInfoProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedChannelInfo />
        </Provider>
      )
    }
  }
}
