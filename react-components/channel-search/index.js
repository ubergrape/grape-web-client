import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import {mapActionsToProps} from '../app/redux'
import {channelSearchSelector} from '../selectors'
import actionNames from './actionNames'

import ChannelSearch from './ChannelSearch'

const ConnectedChannelSearch = connect(
  channelSearchSelector,
  mapActionsToProps(actionNames)
)(ChannelSearch)

export default function init(store) {
  return class ChannelSearchProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedChannelSearch />
        </Provider>
      )
    }
  }
}
