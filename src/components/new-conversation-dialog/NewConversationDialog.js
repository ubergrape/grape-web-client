import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { TakeoverDialog, Tabs, Tab } from '@ubergrape/aurora-ui'
import injectSheet from 'grape-web/lib/jss'
import { OverlayContainer, useModal } from '@react-aria/overlays'

import Groups from './groups'
import People from './people'
import CreateRoom from './create-room'
import theme from './theme'

const NewConversationDialog = ({
  classes,
  isOpen,
  tab,
  setNewConversationTab,
  ...props
}) => {
  const { modalProps } = useModal()

  /* This is needed to dynamically adjust the padding to not overflow custom bar content.
  Usually it works automatically, but virtualized list requires accurate width. */
  const [overflowPadding, setOverflowPadding] = useState(0)

  const onOverflowPaddingChanged = padding => {
    setOverflowPadding(padding)
  }

  const { hideNewConversation } = props

  return (
    <OverlayContainer>
      <div className={classes.wrapper}>
        <TakeoverDialog
          title={
            <FormattedMessage
              id="ncdTitle"
              defaultMessage="New conversation"
              description="title for new conversation dialog"
            />
          }
          isOpen={isOpen}
          onClose={hideNewConversation}
          onOverflowPaddingChanged={onOverflowPaddingChanged}
          isDismissable
          modalProps={modalProps}
          {...props}
        >
          {props.view === 'tabs' ? (
            <Tabs
              onTabClick={setNewConversationTab}
              tab={tab}
              className={classes.tabs}
              align="justify"
            >
              <Tab
                name={
                  <FormattedMessage
                    id="ncdPersonTab"
                    defaultMessage="Person"
                    description="tab title for person tab"
                  />
                }
              >
                <People overflowPadding={overflowPadding} {...props} />
              </Tab>
              <Tab
                name={
                  <FormattedMessage
                    id="ncdGroupTab"
                    defaultMessage="Group"
                    description="tab title for group tab"
                  />
                }
              >
                <Groups overflowPadding={overflowPadding} {...props} />
              </Tab>
            </Tabs>
          ) : (
            <CreateRoom overflowPadding={overflowPadding} {...props} />
          )}
        </TakeoverDialog>
      </div>
    </OverlayContainer>
  )
}

export default injectSheet(theme)(NewConversationDialog)
