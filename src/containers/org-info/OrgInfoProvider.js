import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {orgInfoSelector as selector} from '../../selectors'
import OrgInfo from '../../components/org-info/OrgInfo'

const actionNames = [
  'toggleOrgSettings'
]

const ConnectedOrgInfo = connect(
  selector,
  mapActionsToProps(actionNames)
)(OrgInfo)

export default class OrgInfoProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedOrgInfo />
      </Provider>
    )
  }
}
