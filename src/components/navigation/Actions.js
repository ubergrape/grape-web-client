import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import List from 'grape-web/lib/components/list/list'
import injectSheet from 'grape-web/lib/jss'

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
  const { onNewConversation, classes } = props

  return (
    <List className={classes.root}>
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
    </List>
  )
}

Actions.propTypes = {
  classes: PropTypes.object.isRequired,
  onNewConversation: PropTypes.func.isRequired,
}

export default injectSheet(styles)(Actions)
