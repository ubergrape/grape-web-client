import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import {mapActionsToProps} from '../app/utils'
import {channelSearchSelector} from '../selectors'
import actionsList from './actionsList'

import ChannelSearch from './ChannelSearch'

const ConnectedChannelSearch = connect(
  channelSearchSelector,
  mapActionsToProps(actionsList)
)(ChannelSearch)

export default function init(store) {
  return class ChannelSearchProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedChannelSearch />
        </Provider>
      )
    }
  }
}
