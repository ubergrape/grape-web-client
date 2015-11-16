import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import ChannelSearch from './ChannelSearch'

export default function channelSearchInit(store, elem) {
  function selectActions() {
    let bindedActions = bindActionCreators(actions, store.dispatch)

    return [
        'channelSearchShow',
        'channelSearchHide',
        'channelSearchInput',
        'callRoomManager'
      ]
      .reduce((selectedActions, actionName) => {
        selectedActions[actionName] = bindedActions[actionName]
        return selectedActions
      }, {})
  }


  render(
    <Provider store={store}>
      <ChannelSearch {...selectActions()}/>
    </Provider>,
    elem
  )
}
