import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import merge from 'lodash/merge'

import { A11yDialog, A11yDialogTheme } from '../a11y-dialog'
import { Tabs } from '../tabs'
import Person from './Person'
import Group from './Group'
import styles from './NewConversationTheme'

const NewConversation = ({ hideNewConversation, show, sheet: { classes } }) => (
  <A11yDialog
    id="new-conversation"
    title="New conversation"
    show={show}
    onHide={hideNewConversation}
    classNames={classes}
    closeButtonLabel="Close new conversation dialog window"
  >
    <div>
      <p className={classes.description}>
        Start a conversation with one person. Join or create a group to chat
        with more people.
      </p>
      <Tabs
        tabs={[
          {
            name: 'Person',
            component: Person,
          },
          {
            name: 'Group',
            component: Group,
          },
        ]}
      />
    </div>
  </A11yDialog>
)

NewConversation.propTypes = {
  show: PropTypes.bool.isRequired,
  hideNewConversation: PropTypes.func.isRequired,
  sheet: PropTypes.object.isRequired,
}

export default injectSheet(merge(A11yDialogTheme, styles))(NewConversation)
