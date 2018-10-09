import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import List from 'grape-web/lib/components/list/list'
import injectSheet from 'grape-web/lib/jss'

import { Groups as GroupsText } from '../i18n/i18n'
import { Beacon } from '../intro'
import Action from './Action'

const beaconShift = { top: 10, left: 10 }

const styles = () => ({
  root: {
    display: 'block',
    padding: {
      top: 0,
      bottom: 0,
    },
  },
})

function Actions(props) {
  const { onNewConversation, onManageGroups, classes, permissions } = props

  return (
    <List className={classes.root}>
      {permissions.canCreateRoom && (
        <Action icon="createConversation" onClick={onNewConversation}>
          {({ renderText }) => (
            <FormattedMessage
              id="newConversation"
              description="*Describe NewConversation*: this is used in Navigation"
              defaultMessage="New Conversation"
            >
              {(...children) => (
                <span>
                  {renderText(children)}
                  <Beacon id="pm" placement="right" shift={beaconShift} />
                </span>
              )}
            </FormattedMessage>
          )}
        </Action>
      )}
      {permissions.canCreateRoom && (
        <Action icon="conversations" onClick={onManageGroups}>
          {({ renderText }) => (
            <GroupsText>
              {(...children) => (
                <span>
                  {renderText(children)}
                  <Beacon
                    id="manageGroups"
                    placement="right"
                    shift={beaconShift}
                  />
                </span>
              )}
            </GroupsText>
          )}
        </Action>
      )}
    </List>
  )
}

Actions.propTypes = {
  classes: PropTypes.object.isRequired,
  onNewConversation: PropTypes.func.isRequired,
  onManageGroups: PropTypes.func.isRequired,
  permissions: PropTypes.object,
}

Actions.defaultProps = {
  permissions: {},
}

export default injectSheet(styles)(Actions)
