import React from 'react'
import { TakeoverDialog } from 'aurora'
import { OverlayContainer } from '@react-aria/overlays'

const NewConversationDialog = ({ show, hideNewConversation, ...props }) => {
  return (
    <div>
      <OverlayContainer>
        <TakeoverDialog
          title="Title"
          isOpen={show}
          onClose={hideNewConversation}
          isDismissable
          {...props}
        >
          <span>Children</span>
        </TakeoverDialog>
      </OverlayContainer>
    </div>
  )
}

export default NewConversationDialog
