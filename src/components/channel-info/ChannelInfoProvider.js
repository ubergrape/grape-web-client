import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {channelInfoSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import ChannelInfo from './ChannelInfo'

const ConnectedChannelInfo = connect(
  selector,
  mapActionsToProps(actionNames)
)(ChannelInfo)

export default class ChannelInfoProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedChannelInfo />
      </Provider>
    )
  }
}
