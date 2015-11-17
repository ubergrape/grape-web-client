import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import {connect} from 'react-redux'
import {mapStateToProps, mapActionsToProps} from '../app/utils'
import actionsList from './actionsList'

import ChannelSearch from './ChannelSearch'

export default function init(store, elem) {
  let ConnectedChannelSearch = connect(
                                mapStateToProps('channelSearch'),
                                mapActionsToProps(actionsList)
                              )(ChannelSearch)

  return render(
    <Provider store={store}>
      <ConnectedChannelSearch/>
    </Provider>,
    elem
  )
}
