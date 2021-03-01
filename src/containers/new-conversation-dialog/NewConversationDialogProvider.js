import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'
import { OverlayProvider } from '@react-aria/overlays'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationComponentSelector as selector } from '../../selectors'
import { NewConversationDialog } from '../../components/new-conversation-dialog'

const actionNames = ['showNewConversation', 'hideNewConversation']

const ConnectedNewConversationDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(NewConversationDialog)

export default class NewConversationDialogProvider extends PureComponent {
  render() {
    return (
      <OverlayProvider>
        <Provider store={getStore()}>
          <ConnectedNewConversationDialog />
        </Provider>
      </OverlayProvider>
    )
  }
}
