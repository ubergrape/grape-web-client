import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import {gray} from 'grape-theme/dist/base-colors'

import Tooltip from '../../../tooltip/HoverTooltip'
import createInlineIcon from '../../../inline-icon/create'
import {messageDeliveryStates} from '../../../../constants/app'
import {horizontalMargin} from '../baseMessageTheme'

const messages = {
  pending: (
    <FormattedMessage
      id="pending"
      description="message delivery status in tooltip"
      defaultMessage="Pending"
    />
  ),
  unsent: (
    <FormattedMessage
      id="unsent"
      description="message delivery status in tooltip"
      defaultMessage="Unsent"
    />
  ),
  send: (
    <FormattedMessage
      id="sent"
      description="message delivery status in tooltip"
      defaultMessage="Sent"
    />
  ),
  read: (
    <FormattedMessage
      id="read"
      description="message delivery status in tooltip"
      defaultMessage="Read"
    />
  )
}

const stateIndicatorSize = 12
const stateIndicatorIcon = {
  '&:before': {
    position: 'absolute',
    right: 0,
    top: 0
  }
}

const styles = {
  root: {
    position: 'absolute',
    right: -(stateIndicatorSize + horizontalMargin) / 2,
    bottom: 0,
    width: stateIndicatorSize,
    height: stateIndicatorSize
  },
  pending: {
    composes: '$root',
    extend: [
      createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  unsent: {
    composes: '$root',
    extend: [
      createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  sent: {
    composes: '$root',
    extend: [
      createInlineIcon('checkmark', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  read: {
    composes: '$root',
    extend: [
      createInlineIcon('checkmarkFilled', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  tooltipTrigger: {
    display: 'block',
    width: stateIndicatorSize,
    height: stateIndicatorSize
  }
}

const DeliveryState = ({time, state, classes}) => {
  // Mark only today's messages.
  const isFresh = moment(time).isSame(new Date(), 'day')

  if (!state || state === 'unsent' || !isFresh) return null

  return (
    <span className={classes[state]}>
      <Tooltip
        placement="left"
        message={messages[state]}
      >
        <span className={classes.tooltipTrigger} />
      </Tooltip>
    </span>
  )
}

DeliveryState.propTypes = {
  classes: PropTypes.object.isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  state: PropTypes.oneOf(messageDeliveryStates)
}

DeliveryState.defaultProps = {
  state: undefined
}

export default injectSheet(styles)(DeliveryState)
