import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {channelInfoSelector} from '../selectors'
import actionNames from './actionNames'
import ChannelInfo from './ChannelInfo'

const ConnectedChannelInfo = connect(
  channelInfoSelector,
  mapActionsToProps(actionNames)
)(ChannelInfo)

export default function init(store) {
  return class ChannelInfoProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedChannelInfo />
        </Provider>
      )
    }
  }
}
