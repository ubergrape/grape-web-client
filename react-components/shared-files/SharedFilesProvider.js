import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {sharedFilesSelector as selector} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import SharedFiles from './SharedFiles'

const ConnectedSharedFiles = connect(
  selector,
  mapActionsToProps(actionNames)
)(SharedFiles)

export default class SharedFilesProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedSharedFiles />
      </Provider>
    )
  }
}
