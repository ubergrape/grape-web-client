import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {orgInfoSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import OrgInfo from './OrgInfo'

const ConnectedOrgInfo = connect(
  selector,
  mapActionsToProps(actionNames)
)(OrgInfo)

export default class OrgInfoProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedOrgInfo />
      </Provider>
    )
  }
}
