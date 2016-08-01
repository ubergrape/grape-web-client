import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'

export default function ManageButtons(props) {
  const {
    theme,
    filter,
    showChannelsManager,
    showNewConversation,
    showPmManager
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
            id="NewConversation"
            description="*Describe NewConversation*: this is used in Navigation"
            defaultMessage="New Conversation" />
        </button>
      </li>
      <li className={classes.manageItem} id="intro-step3">
        <button
          className={classes.contacts}
          onClick={showPmManager}>
          <FormattedMessage
            id="Contacts"
            description="*Describe Contacts*: this is used in Navigation"
            defaultMessage="Contacts" />
        </button>
      </li>
      <li className={classes.manageItem} id="intro-step2">
        <button
          className={classes.channels}
          onClick={showChannelsManager}>
          <FormattedMessage
            id="Groups"
            description="*Describe Groups*: this is used in Navigation"
            defaultMessage="Groups" />
        </button>
      </li>
    </ul>
  )
}

ManageButtons.propTypes = {
  theme: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  showChannelsManager: PropTypes.func.isRequired,
  showPmManager: PropTypes.func.isRequired,
  showNewConversation: PropTypes.func.isRequired
}
