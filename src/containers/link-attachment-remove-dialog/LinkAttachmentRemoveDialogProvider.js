import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { linkAttachmentsSelector as selector } from '../../selectors'
import { LinkAttachmentRemoveDialog } from '../../components/link-attachment-remove-dialog'

const actionNames = {
  hideRemoveLinkAttachments: 'onHide',
  removeLinkAttachment: 'onRemove',
}

const ConnectedLinkAttachmentRemoveDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(LinkAttachmentRemoveDialog)

export default class LinkAttachmentRemoveDialogProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedLinkAttachmentRemoveDialog />
      </Provider>
    )
  }
}
