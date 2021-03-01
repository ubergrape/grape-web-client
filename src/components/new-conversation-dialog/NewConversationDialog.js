import React from 'react'
import { TakeoverDialog, Button } from 'aurora-ui'
import { OverlayContainer, useModal } from '@react-aria/overlays'

const NewConversationDialog = ({ isOpen, hideNewConversation, ...props }) => {
  const { modalProps } = useModal()

  return (
    <OverlayContainer>
      <TakeoverDialog
        title="Title"
        isOpen={isOpen}
        onClose={hideNewConversation}
        isDismissable
        modalProps={modalProps}
        {...props}
      >
        <div>
          Children<Button>123</Button>
        </div>
      </TakeoverDialog>
    </OverlayContainer>
  )
}

export default NewConversationDialog
