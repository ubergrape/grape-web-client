import React, {PropTypes} from 'react'

export default function ManageButtons(props) {
  const {
    theme,
    filter,
    showChannelsManager,
    showNewConversation,
    showPmManager
  } = props

  if (filter) return <noscript />

  const {classes} = theme
  return (
    <ul className={classes.manage}>
      <li className={classes.manageItem}>
        <button
          className={classes.newConversation}
          onClick={showNewConversation}>
          New Conversation
        </button>
      </li>
      <li className={classes.manageItem}>
        <button
          className={classes.contacts}
          onClick={showPmManager}>
          Contacts
        </button>
      </li>
      <li className={classes.manageItem}>
        <button
          className={classes.channels}
          onClick={showChannelsManager}>
          Groups
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
