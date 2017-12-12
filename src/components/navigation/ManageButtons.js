import PropTypes from 'prop-types'
import React from 'react'
import {FormattedMessage} from 'react-intl'

import {Contacts, Groups} from '../i18n/i18n'
import {Beacon} from '../intro'

const beaconShift = {top: 10, left: 10}

export default function ManageButtons(props) {
  const {
    theme,
    filter,
    showNewConversation,
    showManageContacts,
    showManageGroups
  } = props

  if (filter) return null

  const {classes} = theme
  return (
    <ul className={classes.manage}>
      <li className={classes.manageItem}>
        <button
          className={classes.newConversation}
          onClick={showNewConversation}
        >
          <FormattedMessage
            id="newConversation"
            description="*Describe NewConversation*: this is used in Navigation"
            defaultMessage="New Conversation"
          />
        </button>
      </li>
      <li className={classes.manageItem}>
        <button
          className={classes.contacts}
          onClick={showManageContacts}
        >
          <Contacts />
          <Beacon id="pm" placement="right" shift={beaconShift} />
        </button>
      </li>
      <li className={classes.manageItem}>
        <button
          className={classes.channels}
          onClick={showManageGroups}
        >
          <Groups />
          <Beacon id="manageGroups" placement="right" shift={beaconShift} />
        </button>
      </li>
    </ul>
  )
}

ManageButtons.propTypes = {
  theme: PropTypes.object.isRequired,
  filter: PropTypes.string.isRequired,
  showManageContacts: PropTypes.func.isRequired,
  showNewConversation: PropTypes.func.isRequired,
  showManageGroups: PropTypes.func.isRequired
}