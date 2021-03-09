import React, { useState } from 'react'
import { TakeoverDialog, Tabs, Tab } from '@ubergrape/aurora-ui'
import injectSheet from 'grape-web/lib/jss'
import { OverlayContainer, useModal } from '@react-aria/overlays'

import { Groups } from './groups'
import theme from './theme'

const NewConversationDialog = ({
  isOpen,
  hideNewConversation,
  classes,
  ...props
}) => {
  const { modalProps } = useModal()

  const [overflowPadding, setOverflowPadding] = useState('0px')

  const onOverflowPaddingChanged = padding => {
    setOverflowPadding(padding)
  }

  return (
    <OverlayContainer>
      <div className={classes.wrapper}>
        <TakeoverDialog
          title="New conversation"
          isOpen={isOpen}
          onClose={hideNewConversation}
          onOverflowPaddingChanged={onOverflowPaddingChanged}
          isDismissable
          modalProps={modalProps}
          {...props}
        >
          <Tabs className={classes.tabs} align="justify">
            <Tab name="Person">
              <div>Tab 1 content</div>
            </Tab>
            <Tab name="Group">
              <Groups overflowPadding={overflowPadding} {...props} />
            </Tab>
          </Tabs>
        </TakeoverDialog>
      </div>
    </OverlayContainer>
  )
}

export default injectSheet(theme)(NewConversationDialog)
