import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import { gray } from 'grape-theme/dist/base-colors'
import sizes from 'grape-theme/dist/sizes'

import { messageDeliveryStates } from '../../../../constants/app'
import Tooltip from '../../../tooltip/HoverTooltip'
import createInlineIcon from '../../../inline-icon/create'
import { horizontalMargin } from '../baseMessageTheme'

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
  ),
}

const indicatorSize = sizes.icon.xs
const icon = {
  '&:before': {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}

const styles = {
  root: {
    position: 'absolute',
    right: -(indicatorSize + horizontalMargin) / 2,
    bottom: 0,
    width: indicatorSize,
    height: indicatorSize,
  },
  pending: {
    composes: '$root',
    extend: [
      createInlineIcon('waiting', { color: gray, size: indicatorSize }),
      icon,
    ],
  },
  unsent: {
    composes: '$root',
    extend: [
      createInlineIcon('waiting', { color: gray, size: indicatorSize }),
      icon,
    ],
  },
  sent: {
    composes: '$root',
    extend: [
      createInlineIcon('checkmark', { color: gray, size: indicatorSize }),
      icon,
    ],
  },
  read: {
    composes: '$root',
    extend: [
      createInlineIcon('checkmarkFilled', { color: gray, size: indicatorSize }),
      icon,
    ],
  },
  tooltipTrigger: {
    display: 'block',
    width: indicatorSize,
    height: indicatorSize,
  },
}

const DeliveryState = ({ time, state, classes }) => {
  // Mark only today's messages.
  const isFresh = moment(time).isSame(new Date(), 'day')

  if (!state || state === 'unsent' || !isFresh) return null

  return (
    <span className={classes[state]}>
      <Tooltip placement="left" message={messages[state]}>
        <span className={classes.tooltipTrigger} />
      </Tooltip>
    </span>
  )
}

DeliveryState.propTypes = {
  classes: PropTypes.object.isRequired,
  time: PropTypes.string.isRequired,
  state: PropTypes.oneOf(messageDeliveryStates),
}

DeliveryState.defaultProps = {
  state: undefined,
}

export default injectSheet(styles)(DeliveryState)
