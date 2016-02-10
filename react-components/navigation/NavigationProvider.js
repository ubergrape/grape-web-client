import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {navigation as selector} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import Navigation from './Navigation'

const ConnectedNavigation = connect(
  selector,
  mapActionsToProps(actionNames)
)(Navigation)

export default class NavigationProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedNavigation />
      </Provider>
    )
  }
}
