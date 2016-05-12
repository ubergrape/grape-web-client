import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {sidebarComponentSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import Sidebar from './Sidebar'

const ConnectedSidebar = connect(
  selector,
  mapActionsToProps(actionNames)
)(Sidebar)

export default class SidebarProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedSidebar />
      </Provider>
    )
  }
}
