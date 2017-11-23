import React from 'react'
import capitalize from 'lodash/string/capitalize'
import moment from 'moment'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import {gray} from 'grape-theme/dist/base-colors'
import cn from 'classnames'

import Tooltip from '../../../tooltip/HoverTooltip'
import createInlineIcon from '../../../inline-icon/create'
import {horizontalMargin} from '../baseMessageTheme'

const deliveryStateTooltipMessages = {
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
  stateIndicator: {
    position: 'absolute',
    right: -(stateIndicatorSize + horizontalMargin) / 2,
    bottom: 0,
    width: stateIndicatorSize,
    height: stateIndicatorSize
  },
  stateIndicatorPending: {
    extend: [
      createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorUnsent: {
    extend: [
      createInlineIcon('waiting', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorSent: {
    extend: [
      createInlineIcon('checkmark', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorRead: {
    extend: [
      createInlineIcon('checkmarkFilled', {color: gray, size: stateIndicatorSize}),
      stateIndicatorIcon
    ]
  },
  stateIndicatorTooltipTrigger: {
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
    <span
      className={cn(
        classes.stateIndicator,
        classes[`stateIndicator${capitalize(state)}`]
      )}
    >
      <Tooltip
        placement="left"
        message={deliveryStateTooltipMessages[state]}
      >
        <span className={classes.stateIndicatorTooltipTrigger} />
      </Tooltip>
    </span>
  )
}

export default injectSheet(styles)(DeliveryState)
