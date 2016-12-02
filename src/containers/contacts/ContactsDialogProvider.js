import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {contactsSelector as selector} from '../../selectors'
import {ContactsDialog} from '../../components/contacts'

const actionNames = {
  goToChannel: 'onSelectUser',
  setContactsFilter: 'onSelectFilter',
  hideContactsDialog: 'onHide'
}

const ConnectedContactsDialog = connect(
  selector,
  mapActionsToProps(actionNames)
)(ContactsDialog)

export default class ContactsDialogProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedContactsDialog />
      </Provider>
    )
  }
}
