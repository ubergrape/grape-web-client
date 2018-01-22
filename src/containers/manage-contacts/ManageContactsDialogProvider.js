import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {manageContactsSelector as selector} from '../../selectors'
import {ManageContactsDialog} from '../../components/manage-contacts'

const actionNames = {
  openPm: 'onSelectUser',
  setManageContactsFilter: 'onSelectFilter',
  hideManageContacts: 'onHide'
}

const ConnectedManageContactsDialog = connect(
  selector,
  mapActionsToProps(actionNames)
)(ManageContactsDialog)

export default class ManageContactsDialogProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedManageContactsDialog />
      </Provider>
    )
  }
}
