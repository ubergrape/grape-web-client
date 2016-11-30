import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {pmManagerSelector as selector} from '../../selectors'
import {PmManagerDialog} from '../../components/pm-manager'

const actionNames = {
  goToChannel: 'onSelectUser',
  setPmManagerFilter: 'onSelectFilter',
  hidePmManager: 'onHide'
}

const ConnectedPmManagerDialog = connect(
  selector,
  mapActionsToProps(actionNames)
)(PmManagerDialog)

export default class PmManagerDialogProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedPmManagerDialog />
      </Provider>
    )
  }
}
