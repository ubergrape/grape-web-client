import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'
import {mapActionsToProps} from '../app/utils'
import {channelSearchSelector} from '../selectors'
import actionsList from './actionsList'

import ChannelSearch from './ChannelSearch'

export default function init(store, elem) {
  let ConnectedChannelSearch = connect(
    channelSearchSelector,
    mapActionsToProps(actionsList)
  )(ChannelSearch)

  return render(
    <Provider store={store}>
      <ConnectedChannelSearch/>
    </Provider>,
    elem
  )
}
