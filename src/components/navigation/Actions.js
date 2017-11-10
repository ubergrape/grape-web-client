import PropTypes from 'prop-types'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import List from 'material-ui/List'

import {Contacts as ContactsText, Groups as GroupsText} from '../i18n/i18n'
import {Beacon} from '../intro'
import Action from './Action'

const beaconShift = {top: 10, left: 10}

export default function Actions(props) {
  const {
    onNewConversation,
    onContacts,
    onManageGroups
  } = props

  return (
    <List>
      <Action icon="createConversation" onClick={onNewConversation}>
        {({renderText}) => (
          <FormattedMessage
            id="newConversation"
            description="*Describe NewConversation*: this is used in Navigation"
            defaultMessage="New Conversation"
          >
            {renderText}
          </FormattedMessage>
        )}
      </Action>
      <Action icon="users" onClick={onContacts}>
        {({renderText}) => (
          <ContactsText>
            {(...children) => (
              <span>
                {renderText(children)}
                <Beacon id="pm" placement="right" shift={beaconShift} />
              </span>
            )}
          </ContactsText>
        )}
      </Action>
      <Action icon="conversations" onClick={onManageGroups}>
        {({renderText}) => (
          <GroupsText>
            {(...children) => (
              <span>
                {renderText(children)}
                <Beacon id="manageGroups" placement="right" shift={beaconShift} />
              </span>
            )}
          </GroupsText>
        )}
      </Action>
    </List>
  )
}

Actions.propTypes = {
  onContacts: PropTypes.func.isRequired,
  onNewConversation: PropTypes.func.isRequired,
  onManageGroups: PropTypes.func.isRequired
}
