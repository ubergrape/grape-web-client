import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {headerSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import Header from './Header'

const ConnectedHeader = connect(
  selector,
  mapActionsToProps(actionNames)
)(Header)

export default class HeaderProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedHeader />
      </Provider>
    )
  }
}
