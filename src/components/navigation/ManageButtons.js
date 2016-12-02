import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

import {Contacts, Groups} from '../i18n/i18n'

export default function ManageButtons(props) {
  const {
    theme,
    filter,
    showChannelsManager,
    showNewConversation,
    showManageContacts
  } = props

  if (filter) return null

  const {classes} = theme
  return (
    <ul className={classes.manage}>
      <li className={classes.manageItem}>
        <button
          className={classes.newConversation}
          onClick={showNewConversation}>
          <FormattedMessage
            id="newConversation"
            description="*Describe NewConversation*: this is used in Navigation"
            defaultMessage="New Conversation" />
        </button>
      </li>
      <li className={classes.manageItem} id="intro-step3">
        <button
          className={classes.contacts}
          onClick={showManageContacts}>
            <Contacts />
        </button>
      </li>
      <li className={classes.manageItem} id="intro-step2">
        <button
          className={classes.channels}
          onClick={showChannelsManager}>
            <Groups />
        </button>
      </li>
    </ul>
  )
}

ManageButtons.propTypes = {
  theme: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  showChannelsManager: PropTypes.func.isRequired,
  showManageContacts: PropTypes.func.isRequired,
  showNewConversation: PropTypes.func.isRequired
}
