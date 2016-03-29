import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {channelSearchSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import ChannelSearch from './ChannelSearch'

const ConnectedChannelSearch = connect(
  selector,
  mapActionsToProps(actionNames)
)(ChannelSearch)

export default class ChannelSearchProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedChannelSearch />
      </Provider>
    )
  }
}
