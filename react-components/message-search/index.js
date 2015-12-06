import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {mentionsSelector} from '../selectors'
import actions from './actions'
import MessageSearch from './MessageSearch'

const ConnectedMessageSearch = connect(
  mentionsSelector,
  mapActionsToProps(actions)
)(MessageSearch)

export default function init(store) {
  return class MessageSearchProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedMessageSearch />
        </Provider>
      )
    }
  }
}
