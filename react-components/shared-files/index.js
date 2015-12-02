import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {sharedFilesSelector} from '../selectors'
import actions from './actions'
import SharedFiles from './SharedFiles'

const ConnectedSharedFiles = connect(
  sharedFilesSelector,
  mapActionsToProps(actions)
)(SharedFiles)

export default function init(store) {
  return class SharedFilesProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedSharedFiles />
        </Provider>
      )
    }
  }
}
