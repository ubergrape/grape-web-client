import React, { useState } from 'react'
import { TakeoverDialog, Tabs, Tab } from '@ubergrape/aurora-ui'
import injectSheet from 'grape-web/lib/jss'
import { OverlayContainer, useModal } from '@react-aria/overlays'

import Groups from './groups'
import CreateRoom from './create-room'
import theme from './theme'

const NewConversationDialog = ({
  classes,
  tab,
  setNewConversationTab,
  ...props
}) => {
  const { modalProps } = useModal()

  const [overflowPadding, setOverflowPadding] = useState(0)

  const onOverflowPaddingChanged = padding => {
    setOverflowPadding(padding)
  }

  return (
    <OverlayContainer>
      <div className={classes.wrapper}>
        <TakeoverDialog
          title="New conversation"
          isOpen={props.isNewConversationOpened}
          onClose={props.hideNewConversation}
          onOverflowPaddingChanged={onOverflowPaddingChanged}
          isDismissable
          modalProps={modalProps}
          {...props}
        >
          {props.isCreateRoomOpened ? (
            <CreateRoom {...props} />
          ) : (
            <Tabs
              onTabClick={setNewConversationTab}
              tab={tab}
              className={classes.tabs}
              align="justify"
            >
              <Tab name="Person">Person tab</Tab>
              <Tab name="Group">
                <Groups overflowPadding={overflowPadding} {...props} />
              </Tab>
            </Tabs>
          )}
        </TakeoverDialog>
      </div>
    </OverlayContainer>
  )
}

export default injectSheet(theme)(NewConversationDialog)
